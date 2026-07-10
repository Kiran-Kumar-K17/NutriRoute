import prisma from "../config/prisma.js";
import {
  OrderSchema,
  VerifyPaymentSchema,
} from "../validators/order.validator.js";
import { razorpay } from "../config/razorpay.js";
import crypto from "crypto";
import { io } from "../config/socket.js";


export const placeOrder = async (data: unknown, customerId: string) => {
  const parsedData = OrderSchema.parse(data);

  // Fetch all food items
  const foodIds = parsedData.items.map((item) => item.foodId);

  const foods = await prisma.food.findMany({
    where: {
      id: {
        in: foodIds,
      },
    },
  });

  // Validate all foods exist
  if (foods.length !== parsedData.items.length) {
    throw new Error("One or more food items were not found.");
  }

  if (foods.length === 0) {
    throw new Error("Order must contain at least one food item.");
  }

  const foodMap = new Map(foods.map((food) => [food.id, food]));

  const restaurantId = foods[0]!.restaurantId;

  // Validate same restaurant
  const isSameRestaurant = foods.every(
    (food) => food.restaurantId === restaurantId,
  );

  if (!isSameRestaurant) {
    throw new Error("All food items must belong to the same restaurant.");
  }

  // Validate availability
  const unavailableFood = foods.find((food) => !food.isAvailable);

  if (unavailableFood) {
    throw new Error(`${unavailableFood.name} is currently unavailable.`);
  }

  // Validate stock and calculate total
  let totalAmount = 0;

  for (const item of parsedData.items) {
    const food = foodMap.get(item.foodId)!;

    if (food.stock < item.quantity) {
      throw new Error(`${food.name} has only ${food.stock} item(s) left.`);
    }

    totalAmount += Number(food.price) * item.quantity;
  }

  let order = await prisma.$transaction(async (tx) => {
    // Create order
    const order = await tx.order.create({
      data: {
        customerId,
        restaurantId,
        totalAmount,

        paymentMethod: parsedData.paymentMethod,

        street: parsedData.street,
        village: parsedData.village,
        city: parsedData.city,
        pincode: parsedData.pincode,

        latitude: parsedData.latitude,
        longitude: parsedData.longitude,
      },
    });

    // Create all order items
    await tx.orderItem.createMany({
      data: parsedData.items.map((item) => {
        const food = foodMap.get(item.foodId)!;

        return {
          orderId: order.id,
          foodId: food.id,
          quantity: item.quantity,
          price: food.price,
        };
      }),
    });

    // Atomically decrement stock
    for (const item of parsedData.items) {
      const updated = await tx.food.updateMany({
        where: {
          id: item.foodId,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updated.count === 0) {
        throw new Error(
          `Insufficient stock for food item: ${foodMap.get(item.foodId)!.name}`,
        );
      }
    }

    // Return complete order
    return await tx.order.findUnique({
      where: {
        id: order.id,
      },
      include: {
        restaurant: true,
        items: {
          include: {
            food: true,
          },
        },
      },
    });
  });

  if (!order) {
    throw new Error("Failed to create order.");
  }

  // Handle Razorpay order creation if payment method is not COD
  if (parsedData.paymentMethod !== "COD") {
    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // convert to paise
        currency: "INR",
        receipt: order.id,
      });

      order = (await prisma.order.update({
        where: { id: order.id },
        data: {
          razorpayOrderId: razorpayOrder.id,
        },
        include: {
          restaurant: true,
          items: {
            include: {
              food: true,
            },
          },
        },
      })) as any;
    } catch (error) {
      // Revert stock and mark order as cancelled/failed
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order!.id },
          data: {
            orderStatus: "CANCELLED",
            paymentStatus: "FAILED",
          },
        });

        for (const item of parsedData.items) {
          await tx.food.update({
            where: { id: item.foodId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      });

      throw new Error(
        `Payment initiation failed: ${error instanceof Error ? error.message : "Razorpay error"}`,
      );
    }
  }

  return order;
};

export const getMyOrders = async (customerId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      customerId,
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          image: true,
          phone: true,
          city: true,
          area: true,
        },
      },
      items: {
        include: {
          food: {
            select: {
              id: true,
              name: true,
              image: true,
              category: true,
              price: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};

export const getOrdersById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          image: true,
          phone: true,
          city: true,
          area: true,
        },
      },
      items: {
        include: {
          food: {
            select: {
              id: true,
              name: true,
              image: true,
              category: true,
              price: true,
            },
          },
        },
      },
    },
  });
  return order;
};

export const getOrderForRestaurant = async (ownerId: string) => {
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId,
    },
  });
  if (!restaurant) {
    throw new Error("Restaurant not found for the given owner.");
  }

  return await prisma.order.findMany({
    where: {
      restaurantId: restaurant.id,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      items: {
        select: {
          quantity: true,
          price: true,
          food: {
            select: {
              id: true,
              name: true,
              image: true,
              category: true,
              price: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const verifyPayment = async (data: unknown) => {
  const parsedData = VerifyPaymentSchema.parse(data);
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    parsedData;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.razorpayOrderId !== razorpayOrderId) {
    throw new Error("Razorpay Order ID mismatch.");
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("Razorpay secret key is not configured.");
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    throw new Error("Invalid payment signature.");
  }

  // Update order status in DB
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      paymentStatus: "PAID",
      paymentId: razorpayPaymentId,
      transactionId: razorpayPaymentId,
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          image: true,
          phone: true,
          city: true,
          area: true,
        },
      },
      items: {
        include: {
          food: {
            select: {
              id: true,
              name: true,
              image: true,
              category: true,
              price: true,
            },
          },
        },
      },
    },
  });
};

export const handleWebhook = async (body: any, signature: string) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Razorpay webhook secret is not configured.");
  }

  // Verify webhook signature
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  if (generatedSignature !== signature) {
    throw new Error("Invalid webhook signature.");
  }

  const event = body.event;
  if (event === "order.paid") {
    const razorpayOrderId = body.payload?.order?.entity?.id;
    const razorpayPaymentId = body.payload?.payment?.entity?.id;

    if (!razorpayOrderId || !razorpayPaymentId) {
      throw new Error("Missing payment or order details in webhook payload.");
    }

    const order = await prisma.order.findFirst({
      where: { razorpayOrderId },
    });

    if (!order) {
      throw new Error("Order not found for this Razorpay Order ID.");
    }

    if (order.paymentStatus !== "PAID") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          paymentId: razorpayPaymentId,
          transactionId: razorpayPaymentId,
        },
      });
    }
  }
};

export const updateOrderStatus = async (
  orderId: string,
  orderStatus: string,
  role: string,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const uppercaseRole = role.toUpperCase();
  const uppercaseStatus = orderStatus.toUpperCase();

  const transitions: Record<string, string[]> = {
    PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
    ACCEPTED: ["PREPARING"],
    PREPARING: ["READY_FOR_PICKUP"],
    READY_FOR_PICKUP: ["PICKED_UP"],
    PICKED_UP: ["OUT_FOR_DELIVERY"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
    DELIVERED: [],
    REJECTED: [],
    CANCELLED: [],
  };

  const permissions: Record<string, string[]> = {
    RESTAURANT: ["ACCEPTED", "REJECTED", "PREPARING", "READY_FOR_PICKUP"],
    DELIVERY: ["PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"],
    CUSTOMER: ["CANCELLED"],
  };

  const allowedStatusesForRole = permissions[uppercaseRole];
  if (
    !allowedStatusesForRole ||
    !allowedStatusesForRole.includes(uppercaseStatus)
  ) {
    throw new Error(`Role '${role}' cannot set status '${orderStatus}'`);
  }

  const allowedNextStatuses = transitions[order.orderStatus] || [];
  if (!allowedNextStatuses.includes(uppercaseStatus)) {
    throw new Error(
      `Cannot change status from '${order.orderStatus}' to '${orderStatus}'`,
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: uppercaseStatus as any },
    include: {
      restaurant: true,
      items: {
        include: {
          food: true,
        },
      },
    },
  });

  if (io) {
    io.to(`order:${orderId}`).emit("order-status-updated", {
      orderId,
      status: uppercaseStatus,
    });
  }

  return updatedOrder;
};

export const acceptOrder = async (orderId: string, deliveryPartnerId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.orderStatus !== "READY_FOR_PICKUP") {
    throw new Error(`Order cannot be accepted because it is in '${order.orderStatus}' status.`);
  }

  if (order.deliveryPartnerId) {
    throw new Error("Order has already been accepted by another delivery partner.");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      deliveryPartnerId,
      orderStatus: "PICKED_UP",
    },
    include: {
      restaurant: true,
      items: {
        include: {
          food: true,
        },
      },
    },
  });

  if (io) {
    io.to(`order:${orderId}`).emit("order-status-updated", {
      orderId,
      status: "PICKED_UP",
      deliveryPartnerId,
    });
  }

  return updatedOrder;
};

