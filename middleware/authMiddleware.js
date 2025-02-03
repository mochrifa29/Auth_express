import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

export const protectMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //request cistom
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Autorization token fail");
    }
  } else {
    res.status(401);
    throw new Error("Not Autorization, no token");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not Autorization is admin");
  }
});

export const verifikasiMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified && req.user.emailVerifiedAt) {
    next();
  } else {
    res.status(401);
    throw new Error("Email belum terverifikasi");
  }
});
