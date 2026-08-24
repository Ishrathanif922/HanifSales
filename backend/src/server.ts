import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/database";
import mongoose from "mongoose";
import { configureCloudinary } from "./config/cloudinary";
import { errorHandler } from "./middleware/errorHandler";
import {
  authRoutes,
  productRoutes,
  orderRoutes,
  cartRoutes,
  reviewRoutes,
  categoryRoutes,
  notificationRoutes,
  adminRoutes,
  ticketRoutes,
  brandRoutes,
  adminBrandRoutes,
  blogRoutes,
  adminBlogRoutes,
  bannerRoutes,
  adminBannerRoutes,
  uploadRoutes,
} from "./routes";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
configureCloudinary();

app.use(helmet());
app.use(morgan("dev"));

app.post("/api/orders/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_URL,
        "https://hanif-sales.netlify.app",
        "http://localhost:3000",
        "http://localhost:3001",
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".netlify.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (origin.endsWith(".netlify.app") || origin.includes("localhost"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, please try again later.",
});
app.use("/api/", limiter);

app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err: any) {
    console.error("Database connection middleware error:", err);
    res.status(500).json({ status: "error", message: "Database connection failed: " + (err.message || "Unknown error") });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/admin/brands", adminBrandRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/admin/banners", adminBannerRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (_, res) => {
  res.json({ status: "success", message: "Hanif Sales API is running successfully!" });
});

app.get("/api", (_, res) => {
  res.json({ status: "success", message: "Hanif Sales API is running successfully!" });
});

app.get("/api/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

export default app;
