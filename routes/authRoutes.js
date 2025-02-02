import express from "express";
import { registerUser } from "../controller/authController.js";
const router = express.Router();

router.post("/login", (req, res) => {
  res.send("Login Router");
});
router.post("/register", registerUser);
router.post("/logout", (req, res) => {
  res.send("Logout Router");
});
router.get("/getuser", (req, res) => {
  res.send("GetUser Router");
});

export default router;
