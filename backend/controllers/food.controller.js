import { Food } from "../models/food.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
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
    if (!req.file) {
      return res.status(400).json({
        error: "Restaurant image is required",
      });
    }

    const uploadImage = await uploadToCloudinary(req.file.buffer, "foods");
    const food = await Food.create({
      name,
      description,
      price,
      category,
      image: uploadImage.secure_url,
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
