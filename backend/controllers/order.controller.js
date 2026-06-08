import { Order } from "../models/order.model.js";
import { Food } from "../models/food.model.js";
import { Restaurant } from "../models/restaurant.model.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { restaurantId, items, deliveryAddress, paymentMethod } = req.body;
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

    const order = await Order.create({
      user: req.user.id,
      restaurantId,
      items: orderedItems,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      deliveryAddress,
      orderStatus: "Pending",
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "name email phone")
      .populate("restaurantId", "name")
      .populate("items.food", "name price image");

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
