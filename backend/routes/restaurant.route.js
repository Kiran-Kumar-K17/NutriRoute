import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createRestaurant } from "../controllers/restaurant.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();
router.post("/create", protect, upload.single("image"), createRestaurant);
export default router;
