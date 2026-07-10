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

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getMyOrders(req.user!.id);
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      orders,
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

export const getOrdersById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const order = await orderService.getOrdersById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
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

export const getOrderForRestaurant = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getOrderForRestaurant(req.user!.id);
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      orders,
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

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const order = await orderService.verifyPayment(req.body);

    return res.status(200).json({
      success: true,
      message: "Payment verified and order updated successfully.",
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

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;
    if (!signature) {
      return res.status(400).json({
        success: false,
        message: "Missing webhook signature.",
      });
    }

    await orderService.handleWebhook(req.body, signature);

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully.",
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

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const order = await orderService.updateOrderStatus(
      id,
      status,
      req.user!.role,
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
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

export const acceptOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deliveryPartnerId = req.user!.id;

    const order = await orderService.acceptOrder(id, deliveryPartnerId);

    return res.status(200).json({
      success: true,
      message: "Order accepted successfully.",
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
