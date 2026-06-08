import { Router } from "express";
import { createFood } from "../controllers/food.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/create", protect, upload.single("image"), createFood);

export default router;
