import { protect } from "../middleware/auth.middleware";
import {
  updateLocation,
  getAssignedOrders,
} from "../controllers/delivery.controller";
import { Router } from "express";

const router = Router();
router.patch("/location", protect, updateLocation);
router.get("/orders", protect, getAssignedOrders);

export default router;
