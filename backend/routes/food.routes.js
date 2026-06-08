import { Router } from "express";
import {
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/food.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/create", protect, upload.single("image"), createFood);
router.put("/:foodId", protect, upload.single("image"), updateFood);
router.delete("/:foodId", protect, deleteFood);

export default router;
