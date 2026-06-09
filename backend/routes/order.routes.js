import { Router } from "express";
import {
  createOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/create", protect, createOrder);
router.patch("/:orderId/status", protect, updateOrderStatus);
export default router;
