import {
  createFood,
  deleteFood,
  getAllFoods,
  getFoodById,
  getMyFoods,
  searchFoods,
  toggleFoodAvailability,
  updateFood,
} from "../controllers/food.controller.js";
import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.post(
  "/create",
  protect,
  authorize("RESTAURANT"),
  upload.single("image"),
  createFood,
);
router.patch(
  "/:id/availability",
  protect,
  authorize("RESTAURANT"),
  toggleFoodAvailability,
);
router.get("/search", searchFoods);
router.get("/", getAllFoods);
router.get("/my-foods", protect, authorize("RESTAURANT"), getMyFoods);
router.get("/:id", getFoodById);

router.patch(
  "/:id",
  protect,
  authorize("RESTAURANT"),
  upload.single("image"),
  updateFood,
);

router.delete("/:id", protect, authorize("RESTAURANT"), deleteFood);
export default router;
