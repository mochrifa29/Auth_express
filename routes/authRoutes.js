import express from "express";
import {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
} from "../controller/authController.js";
import { protectMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", protectMiddleware, logoutUser);
router.get("/getuser", protectMiddleware, currentUser);

export default router;
