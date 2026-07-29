import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createWorkoutSession,
  getWorkoutSessions,
  getWorkoutSessionById,
} from "../controllers/workoutSessionController.js";

const router = express.Router();

router.post("/", protect, createWorkoutSession);

router.get("/", protect, getWorkoutSessions);

router.get("/:id", protect, getWorkoutSessionById);

export default router;