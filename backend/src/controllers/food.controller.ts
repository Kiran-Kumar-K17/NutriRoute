import { Request, Response } from "express";
import * as foodService from "../services/food.service.js";

export const createFood = async (req: Request, res: Response) => {
  try {
    const food = await foodService.createFood(req.body, req.file, req.user!.id);
    return res.status(200).json({
      success: true,
      message: "Food created successfully",
      food,
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
export const getAllFoods = async (req: Request, res: Response) => {
  try {
    const foods = await foodService.getAllFoods();

    return res.status(200).json({
      success: true,
      foods,
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

export const getFoodById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const food = await foodService.getFoodById(req.params.id);

    return res.status(200).json({
      success: true,
      food,
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

export const getMyFoods = async (req: Request, res: Response) => {
  try {
    const foods = await foodService.getMyFoods(req.user!.id);
    return res.status(200).json({
      success: true,
      foods,
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
export const updateFood = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const food = await foodService.updateFood(
      req.params.id,
      req.user!.id,
      req.body,
      req.file,
    );

    return res.status(200).json({
      success: true,
      message: "Food updated successfully",
      food,
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
export const deleteFood = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await foodService.deleteFood(req.params.id, req.user!.id);

    return res.status(200).json({
      success: true,
      message: "Food deleted successfully",
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

export const toggleFoodAvailability = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const food = await foodService.toggleFoodAvailability(
      req.params.id,
      req.user!.id,
    );

    return res.status(200).json({
      success: true,
      message: `Food is now ${food.isAvailable ? "available" : "unavailable"}`,
      food,
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
export const searchFoods = async (req: Request, res: Response) => {
  try {
    const query = String(req.query.q || "");

    const foods = await foodService.searchFoods(query);

    return res.status(200).json({
      success: true,
      foods,
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
