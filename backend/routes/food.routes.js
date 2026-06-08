import { Router } from "express";
import { createFood } from "../controllers/food.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", protect, createFood);

export default router;
