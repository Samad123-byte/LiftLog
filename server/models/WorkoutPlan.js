import mongoose from "mongoose";

const workoutExerciseSchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },

    sets: {
      type: Number,
      required: true,
      min: 1,
    },

    reps: {
      type: String,
      required: true,
    },

    restTime: {
      type: Number,
      default: 60,
    },

    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

daysOfWeek: [
  {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
],

    exercises: [workoutExerciseSchema],
  },
  {
    timestamps: true,
  }
);

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);

export default WorkoutPlan;