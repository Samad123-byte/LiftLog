import mongoose from "mongoose";

// Each completed set
const setSchema = new mongoose.Schema(
  {
    weight: {
      type: Number,
      required: true,
      min: 0,
    },

    reps: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

// Each exercise performed during the workout
const workoutExerciseSchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },

    sets: [setSchema],
  },
  { _id: false }
);

// Workout Session
const workoutSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workoutPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
      required: true,
    },

    exercises: [workoutExerciseSchema],

    duration: {
      type: Number,
      default: 0, // minutes
    },

    totalVolume: {
  type: Number,
  default: 0,
},

totalSets: {
  type: Number,
  default: 0,
},

totalReps: {
  type: Number,
  default: 0,
},

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutSession = mongoose.model(
  "WorkoutSession",
  workoutSessionSchema
);

export default WorkoutSession;