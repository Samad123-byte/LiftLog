import express from "express";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
} from "../controllers/exerciseController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  admin,
  upload.single("thumbnail"),
  createExercise
);

router.put(
  "/:id",
  protect,
  admin,
  upload.single("thumbnail"),
  updateExercise
);

router.delete("/:id", protect, admin, deleteExercise);

router.get("/", getAllExercises);

router.get("/:id", getExerciseById);

export default router;