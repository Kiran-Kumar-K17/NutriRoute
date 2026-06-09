import { Restaurant } from "../models/restaurant.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";

export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      phone,
      email,
      address,
      cuisine,
      openingTime,
      closingTime,
    } = req.body;

    const ownerId = req.user.id;

    const existingRestaurant = await Restaurant.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingRestaurant) {
      return res.status(400).json({
        error: "Restaurant already exists with this email or phone",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        error: "Restaurant image is required",
      });
    }

    const uploadImage = await uploadToCloudinary(
      req.file.buffer,
      "restaurants",
    );

    const restaurant = await Restaurant.create({
      name,
      description,
      image: uploadImage.secure_url,
      imagePublicId: uploadImage.public_id,
      phone,
      email,
      address,
      cuisine,
      openingTime,
      closingTime,
      ownerId,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
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
    const {
      name,
      description,
      phone,
      email,
      address,
      cuisine,
      openingTime,
      closingTime,
    } = req.body;
    if (req.file) {
      if (restaurant.imagePublicId) {
        await deleteFromCloudinary(restaurant.imagePublicId);
      }
      const uploadImage = await uploadToCloudinary(
        req.file.buffer,
        "restaurants",
      );
      restaurant.image = uploadImage.secure_url;
      restaurant.imagePublicId = uploadImage.public_id;
    }
    restaurant.name = name ?? restaurant.name;
    restaurant.description = description ?? restaurant.description;
    restaurant.phone = phone ?? restaurant.phone;
    restaurant.email = email ?? restaurant.email;
    restaurant.address = address ?? restaurant.address;
    restaurant.cuisine = cuisine ?? restaurant.cuisine;
    restaurant.openingTime = openingTime ?? restaurant.openingTime;
    restaurant.closingTime = openingTime ?? restaurant.openingTime;
    await restaurant.save();
    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

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
    if (restaurant.imagePublicId) {
      await deleteFromCloudinary(restaurant.imagePublicId);
    }
    await Restaurant.findByIdAndDelete(restaurant);

    return res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
