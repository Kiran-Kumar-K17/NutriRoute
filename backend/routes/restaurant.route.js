import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from "../controllers/restaurant.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();
router.post("/create", protect, upload.single("image"), createRestaurant);
router.put("/:restaurantId", protect, upload.single("image"), updateRestaurant);
router.delete("/:restaurantId", protect, deleteRestaurant);
export default router;
