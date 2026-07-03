import { Request, Response, NextFunction } from "express";
import { generateToken } from "../utils/jwt.js";
import * as authService from "../services/auth.service.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json({
      ...result,
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json({
      ...result,
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
