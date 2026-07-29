import Exercise from "../models/Exercise.js";

function parseSecondaryMuscles(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return [...new Set(value.filter(Boolean))];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return [...new Set(parsed.filter(Boolean))];
    }
  } catch {
    // Fall back to comma-separated input.
  }

  return [
    ...new Set(
      String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

export const createExercise = async (req, res) => {
  try {
    const {
      name,
      muscleGroup,
      equipment,
      difficulty,
      exerciseType,
      instructions,
      commonMistakes,
      tips,
      videoUrl,
    } = req.body;

    const thumbnail = req.file ? req.file.path : "";
    const secondaryMuscles = parseSecondaryMuscles(
      req.body.secondaryMuscles,
    ).filter((muscle) => muscle !== muscleGroup);

    const existingExercise = await Exercise.findOne({ name });

    if (existingExercise) {
      return res.status(400).json({
        success: false,
        message: "Exercise already exists",
      });
    }

    const exercise = await Exercise.create({
      name,
      muscleGroup,
      secondaryMuscles,
      equipment,
      difficulty,
      exerciseType,
      instructions,
      commonMistakes,
      tips,
      videoUrl,
      thumbnail,
    });

    res.status(201).json({
      success: true,
      message: "Exercise created successfully.",
      exercise,
    });
  } catch (error) {
    console.error("Create Exercise Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: exercises.length,
      exercises,
    });
  } catch (error) {
    console.error("Get Exercises Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      success: true,
      exercise,
    });
  } catch (error) {
    console.error("Get Exercise Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    const {
      name,
      muscleGroup,
      equipment,
      difficulty,
      exerciseType,
      instructions,
      commonMistakes,
      tips,
      videoUrl,
    } = req.body;

    if (name !== undefined) exercise.name = name;
    if (muscleGroup !== undefined) exercise.muscleGroup = muscleGroup;
    if (equipment !== undefined) exercise.equipment = equipment;
    if (difficulty !== undefined) exercise.difficulty = difficulty;
    if (exerciseType !== undefined) exercise.exerciseType = exerciseType;
    if (instructions !== undefined) exercise.instructions = instructions;
    if (commonMistakes !== undefined) exercise.commonMistakes = commonMistakes;
    if (tips !== undefined) exercise.tips = tips;
    if (videoUrl !== undefined) exercise.videoUrl = videoUrl;

    if (req.body.secondaryMuscles !== undefined) {
      exercise.secondaryMuscles = parseSecondaryMuscles(
        req.body.secondaryMuscles,
      ).filter((muscle) => muscle !== exercise.muscleGroup);
    }

    if (req.file) {
      exercise.thumbnail = req.file.path;
    }

    await exercise.save();

    res.status(200).json({
      success: true,
      message: "Exercise updated successfully.",
      exercise,
    });
  } catch (error) {
    console.error("Update Exercise Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    await exercise.deleteOne();

    res.status(200).json({
      success: true,
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    console.error("Delete Exercise Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
