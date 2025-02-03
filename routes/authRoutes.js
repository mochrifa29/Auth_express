import express from "express";
import {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
  generateOtp,
  verifikasiUser,
} from "../controller/authController.js";
import { protectMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", protectMiddleware, logoutUser);
router.get("/getuser", protectMiddleware, currentUser);
router.post("/generateOtp", protectMiddleware, generateOtp);
router.post("/verifikasi-akun", protectMiddleware, verifikasiUser);

export default router;
