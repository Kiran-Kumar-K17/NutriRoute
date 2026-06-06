import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
