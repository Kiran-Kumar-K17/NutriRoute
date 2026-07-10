import { Router } from "express";
import {
  placeOrder,
  getMyOrders,
  getOrdersById,
  getOrderForRestaurant,
  verifyPayment,
  handleRazorpayWebhook,
  updateOrderStatus,
  acceptOrder,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/create", protect, authorize("CUSTOMER"), placeOrder);
router.post("/verify-payment", protect, authorize("CUSTOMER"), verifyPayment);
router.post("/webhook", handleRazorpayWebhook);
router.post("/:id/accept", protect, authorize("DELIVERY"), acceptOrder);
router.patch("/:id/status", protect, updateOrderStatus);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrdersById);
router.get(
  "/restaurant/:ownerId",
  protect,
  authorize("RESTAURANT"),
  getOrderForRestaurant,
);

export default router;
