import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createWorkoutPlan,
  getWorkoutPlans,
  getWorkoutPlanById,
  updateWorkoutPlan,
  deleteWorkoutPlan,
getTodayWorkout
} from "../controllers/workoutPlanController.js";

const router = express.Router();

router.post("/", protect, createWorkoutPlan);

router.get("/", protect, getWorkoutPlans);

router.get("/today", protect, getTodayWorkout);

router.get("/:id", protect, getWorkoutPlanById);

router.put("/:id", protect, updateWorkoutPlan);

router.delete("/:id", protect, deleteWorkoutPlan);

export default router;