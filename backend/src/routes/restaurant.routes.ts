import { Router } from "express";
import { createRestaurant } from "../controllers/restaurant.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/create", protect, authorize("RESTAURANT"), createRestaurant);

export default router;
