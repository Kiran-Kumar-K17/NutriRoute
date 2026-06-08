import { Router } from "express";
import { createOrder } from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/create", protect, createOrder);
export default router;
