import express from "express";
import { protectMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { allUser } from "../controller/userController.js";

const router = express.Router();

router.get("/", protectMiddleware, isAdmin, allUser);

export default router;
