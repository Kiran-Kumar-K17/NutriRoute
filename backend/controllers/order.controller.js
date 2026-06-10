import { Order } from "../models/order.model.js";
import { Food } from "../models/food.model.js";
import { User } from "../models/user.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { getIO } from "../utils/socket.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      razorpay_order_id,
      razorpay_payment_id,
    } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({
        error: "Order must contain at least one food item",
      });
    }
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant not found",
      });
    }
    if (restaurant.ownerId.toString() === userId) {
      return res.status(403).json({
        error: "Owners cannot order from their own restaurant.",
      });
    }
    let totalAmount = 0;

    const foodIds = items.map((item) => item.foodId);

    const foods = await Food.find({
      _id: { $in: foodIds },
    });

    if (foods.length !== foodIds.length) {
      return res.status(404).json({
        error: "One or more food items not found",
      });
    }
    const foodMap = new Map(foods.map((food) => [food._id.toString(), food]));

    const orderedItems = items.map((item) => {
      const food = foodMap.get(item.foodId);

      if (!food) {
        throw new Error(`Food not found: ${item.foodId}`);
      }

      totalAmount += food.price * item.quantity;

      return {
        foodId: food._id,
        quantity: item.quantity,
        price: food.price,
      };
    });

    const invalidFood = foods.find(
      (food) => food.restaurantId.toString() !== restaurantId,
    );

    if (invalidFood) {
      return res.status(400).json({
        error: "Food item does not belong to this restaurant",
      });
    }
    const order = await Order.create({
      userId,
      restaurantId,
      items: orderedItems,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      deliveryAddress,
      razorpayOrderId: razorpay_order_id || null,
      paymentId: razorpay_payment_id || null,
      orderStatus: "Pending",
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "name email phone")
      .populate("restaurantId", "name")
      .populate("items.foodId", "name price image");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const role = req.user.role;

    const transitions = {
      Pending: ["Accepted", "Rejected", "Cancelled"],
      Accepted: ["Preparing"],
      Preparing: ["Ready for Pickup"],
      "Ready for Pickup": ["Picked Up"],
      "Picked Up": ["Out for Delivery"],
      "Out for Delivery": ["Delivered"],
      Delivered: [],
      Rejected: [],
      Cancelled: [],
    };

    const permissions = {
      restaurant: ["Accepted", "Rejected", "Preparing", "Ready for Pickup"],
      delivery: ["Picked Up", "Out for Delivery", "Delivered"],
      customer: ["Cancelled"],
    };

    if (!permissions[role].includes(orderStatus)) {
      return res.status(403).json({
        success: false,
        message: `Role '${role}' cannot set status '${orderStatus}'`,
      });
    }

    const allowedNextStatuses = transitions[order.orderStatus] || [];

    if (!allowedNextStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from '${order.orderStatus}' to '${orderStatus}'`,
      });
    }
    order.orderStatus = orderStatus;
    await order.save();

    const io = getIO();

    io.to(order._id.toString()).emit("order-status-updated", {
      orderId: order._id,
      orderStatus,
    });

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "deliveryPartnerId",
      "name phone currentLocation",
    );
    console.log("Delivery Partner ID:", order.deliveryPartnerId);
    const allowedStatuses = ["Picked Up", "Out for Delivery"];
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    if (!allowedStatuses.includes(order.orderStatus)) {
      return res.status(200).json({
        success: true,
        orderStatus: order.orderStatus,
        location: null,
      });
    }
    return res.status(200).json({
      success: true,
      orderStatus: order.orderStatus,
      location: order.deliveryPartnerId?.currentLocation || null,
      deliveryPartner: order.deliveryPartnerId
        ? {
            name: order.deliveryPartnerId.name,
            phone: order.deliveryPartnerId.phone,
          }
        : null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPartnerId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const deliveryUser = await User.findById(deliveryPartnerId);

    if (!deliveryUser || deliveryUser.role !== "delivery") {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery partner",
      });
    }

    order.deliveryPartnerId = deliveryUser._id;
    order.orderStatus = "Assigned";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Delivery partner assigned",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
