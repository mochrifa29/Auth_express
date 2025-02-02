import express from "express";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundPath } from "./middleware/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRouter);

app.use(notFoundPath);
app.use(errorHandler);

try {
  await mongoose.connect(process.env.DATABASE);
  console.log("Database Connected");
} catch (error) {
  console.log("Database Error");
}

app.listen(port, () => {
  console.log(`Aplikasi jalan di port ${port}`);
});
