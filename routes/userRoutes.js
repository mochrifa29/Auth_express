import express from "express";
import {
  protectMiddleware,
  isAdmin,
  verifikasiMiddleware,
} from "../middleware/authMiddleware.js";
import { allUser } from "../controller/userController.js";

const router = express.Router();

router.get("/allUser", protectMiddleware, isAdmin, allUser);
router.get(
  "/verifikasi",
  protectMiddleware,
  verifikasiMiddleware,
  (req, res) => {
    return res.status(200).json({
      message: "User sudah verifikasi",
    });
  }
);

export default router;
