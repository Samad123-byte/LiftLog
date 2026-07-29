import mongoose from "mongoose";

const personalRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },

    bestWeight: {
      type: Number,
      default: 0,
    },

    bestReps: {
      type: Number,
      default: 0,
    },

    workoutSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutSession",
    },

    achievedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

personalRecordSchema.index(
  {
    user: 1,
    exercise: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "PersonalRecord",
  personalRecordSchema
);