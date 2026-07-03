import { Food } from "../models/food.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";

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
      imagePublicId: uploadImage.public_id,
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

export const updateFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findById(foodId).populate("restaurantId");

    if (!food) {
      return res.status(404).json({
        error: "Food not found",
      });
    }
    console.log(food);
    if (!food.restaurantId) {
      return res.status(404).json({
        error: "Restaurant not found",
      });
    }

    if (food.restaurantId.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You are not the owner of this restaurant",
      });
    }

    const { name, description, price, category, stock, isAvailable } = req.body;

    if (req.file) {
      if (food.imagePublicId) {
        await deleteFromCloudinary(food.imagePublicId);
      }
      const uploadImage = await uploadToCloudinary(req.file.buffer, "foods");

      food.image = uploadImage.secure_url;
      food.imagePublicId = uploadImage.public_id;
    }

    food.name = name ?? food.name;
    food.description = description ?? food.description;
    food.price = price ?? food.price;
    food.category = category ?? food.category;
    food.stock = stock ?? food.stock;
    food.isAvailable = isAvailable ?? food.isAvailable;

    await food.save();
    return res.status(200).json({
      success: true,
      message: "Food updated successfully",
      food,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    const food = await Food.findById(foodId).populate("restaurantId");

    if (!food) {
      return res.status(404).json({
        error: "Food not found",
      });
    }

    if (!food.restaurantId) {
      return res.status(404).json({
        error: "Restaurant not found",
      });
    }

    if (food.restaurantId.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You are not the owner of this restaurant",
      });
    }
    if (food.imagePublicId) {
      await deleteFromCloudinary(food.imagePublicId);
    }
    await Food.findByIdAndDelete(foodId);

    return res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate(
      "restaurantId",
      "name description",
    );
    return res.status(200).json({
      success: true,
      foods,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
