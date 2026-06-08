import { Restaurant } from "../models/restaurant.model.js";

export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
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

    const restaurant = await Restaurant.create({
      name,
      description,
      image,
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
