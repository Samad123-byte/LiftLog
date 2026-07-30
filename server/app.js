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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workout-plans", workoutPlanRoutes);
app.use("/api/workout-sessions", workoutSessionRoutes);
app.use("/api/records", personalRecordRoutes);

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "🚀 LiftLog API is running...",
  });
});

export default app;
