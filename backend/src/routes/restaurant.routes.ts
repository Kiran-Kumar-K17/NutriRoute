import { Router } from "express";
import {
  createRestaurant,
  getAllRestaurants,
} from "../controllers/restaurant.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.post(
  "/create",
  protect,
  authorize("RESTAURANT"),
  upload.single("image"),
  createRestaurant,
);

router.get("/all", getAllRestaurants);

export default router;
