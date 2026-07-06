import { Router } from "express";
import {
  createRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getMyRestaurant,
  getRestaurantById,
  updateRestaurant,
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
router.get("/me", protect, authorize("RESTAURANT"), getMyRestaurant);
router.get("/:id", protect, getRestaurantById);

router.patch(
  "/",
  protect,
  authorize("RESTAURANT"),
  upload.single("image"),
  updateRestaurant,
);

router.delete("/", protect, authorize("RESTAURANT"), deleteRestaurant);

export default router;
