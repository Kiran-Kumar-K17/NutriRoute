import { Request, Response } from "express";
import * as restaurantService from "../services/restaurant.service.js";

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await restaurantService.createRestaurant(
      req.body,
      req.user!.id,
    );

    return res.status(201).json({
      success: true,
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
