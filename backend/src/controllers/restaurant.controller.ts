import { Request, Response } from "express";
import * as restaurantService from "../services/restaurant.service.js";

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await restaurantService.createRestaurant(
      req.body,
      req.file,
      req.user!.id,
    );

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    return res.status(200).json({
      success: true,
      message: "Restaurants data successfully fetched",
      restaurants,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
