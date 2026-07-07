import prisma from "../config/prisma.js";
import { OrderSchema } from "../validators/order.validator.js";

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

  return await prisma.$transaction(async (tx) => {
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
};
