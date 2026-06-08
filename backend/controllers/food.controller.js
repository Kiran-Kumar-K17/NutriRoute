import { Food } from "../models/food.model.js";
import { Restaurant } from "../models/restaurant.model.js";

export const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      restaurantId,
      stock,
      isAvailable,
    } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant not found",
      });
    }
    if (restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You are not the owner of this restaurant",
      });
    }
    const food = await Food.create({
      name,
      description,
      price,
      category,
      image,
      restaurantId,
      stock,
      isAvailable,
    });

    return res.status(201).json({
      success: true,
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
