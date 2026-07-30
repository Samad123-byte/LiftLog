import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import workoutPlanRoutes from "./routes/workoutPlanRoutes.js";
import workoutSessionRoutes from "./routes/workoutSessionRoutes.js";
import personalRecordRoutes from "./routes/personalRecordRoutes.js";

dotenv.config();

const app = express();

const configuredOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS || "").split(","),
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "",
]
  .map((origin) => origin?.trim().replace(/\/$/, ""))
  .filter(Boolean);

const allowedOrigins = new Set(configuredOrigins);

app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(
  cors({
    origin(origin, callback) {
      // Server-to-server tools and same-origin requests may not send Origin.
      if (!origin || allowedOrigins.has(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workout-plans", workoutPlanRoutes);
app.use("/api/workout-sessions", workoutSessionRoutes);
app.use("/api/records", personalRecordRoutes);

app.get(["/api", "/api/health"], (req, res) => {
  res.status(200).json({
    success: true,
    message: "LiftLog API is running.",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error("LiftLog API error:", error.message);

  return res.status(error.message?.startsWith("CORS blocked") ? 403 : 500).json({
    success: false,
    message:
      error.message?.startsWith("CORS blocked")
        ? "This website is not allowed to access the LiftLog API."
        : "Server error.",
  });
});

export default app;
