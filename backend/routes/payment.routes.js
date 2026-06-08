import { Router } from "express";
import {
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";

const router = Router();
router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyPayment);

export default router;
