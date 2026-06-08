import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createRestaurant } from "../controllers/restaurant.controller.js";

const router = Router();
router.post("/create", protect, createRestaurant);
export default router;
