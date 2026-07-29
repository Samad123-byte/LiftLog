import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { getProfile, updateProfile, uploadProfileImage } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put(
    "/profile",
    protect,
    updateProfile
);

router.put(
  "/profile-image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

export default router;