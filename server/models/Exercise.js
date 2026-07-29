import mongoose from "mongoose";

const muscleGroups = [
  "Chest",
  "Back",
  "Shoulders",
  "Legs",
  "Biceps",
  "Triceps",
  "Core",
  "Forearms",
  "Glutes",
  "Full Body",
  "Cardio",
];

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exercise name is required"],
      trim: true,
      unique: true,
    },

    muscleGroup: {
      type: String,
      required: true,
      enum: muscleGroups,
    },

    secondaryMuscles: [
      {
        type: String,
        enum: muscleGroups,
      },
    ],

    equipment: {
      type: String,
      required: true,
      enum: [
        "Barbell",
        "Dumbbell",
        "Machine",
        "Cable",
        "Bodyweight",
        "Kettlebell",
        "Resistance Band",
        "EZ Bar",
        "Smith Machine",
        "Other",
      ],
    },

    difficulty: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },

    exerciseType: {
      type: String,
      required: true,
      enum: ["Compound", "Isolation"],
    },

    instructions: {
      type: String,
      required: true,
      trim: true,
    },

    commonMistakes: {
      type: String,
      default: "",
      trim: true,
    },

    tips: {
      type: String,
      default: "",
      trim: true,
    },

    videoUrl: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
