import { Request, Response } from "express";
import * as orderService from "../services/order.service.js";

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.placeOrder(req.body, req.user!.id);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
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
