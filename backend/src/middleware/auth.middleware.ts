import { verifyToken } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";
export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
    const token = authHeader.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};
