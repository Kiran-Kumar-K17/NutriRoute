import { Request, Response } from "express";
import { generateToken } from "../utils/jwt.js";
import * as authService from "../services/auth.service.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      user,
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
