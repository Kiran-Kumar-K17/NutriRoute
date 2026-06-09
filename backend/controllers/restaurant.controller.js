import { Restaurant } from "../models/restaurant.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
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
