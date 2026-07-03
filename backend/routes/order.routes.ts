import { Router } from "express";
import {
  createOrder,
  updateOrderStatus,
  getOrderTracking,
  assignDeliveryPartner,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/create", protect, createOrder);
router.patch("/:orderId/status", protect, updateOrderStatus);
router.get("/:orderId/tracking", protect, getOrderTracking);
router.patch("/:orderId/assign-delivery", protect, assignDeliveryPartner);
export default router;
