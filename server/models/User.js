import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Authentication
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    // Fitness Profile
    age: {
      type: Number,
      default: null,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },

    height: {
      type: Number, // centimetres
      default: null,
    },

    currentWeight: {
      type: Number, // kilograms
      default: null,
    },

    targetWeight: {
      type: Number, // kilograms
      default: null,
    },

    goal: {
      type: String,
      enum: ["Gain Muscle", "Lose Fat", "Maintain Weight"],
      default: null,
    },

    activityLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    // User Role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;