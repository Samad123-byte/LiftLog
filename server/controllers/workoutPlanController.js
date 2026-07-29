import WorkoutPlan from "../models/WorkoutPlan.js";
import Exercise from "../models/Exercise.js";

// Create Workout Plan
export const createWorkoutPlan = async (req, res) => {
  try {
 const {
  name,
  description,
  daysOfWeek,
  exercises,
} = req.body;

if (!daysOfWeek || daysOfWeek.length === 0) {
  return res.status(400).json({
    success: false,
    message: "Please select at least one workout day.",
  });
}

    // Validation
    if (!name || !exercises || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Workout name and exercises are required.",
      });
    }

    // Verify every exercise exists
    for (const item of exercises) {
      const exercise = await Exercise.findById(item.exercise);

      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: `Exercise not found: ${item.exercise}`,
        });
      }
    }

    const existingPlan = await WorkoutPlan.findOne({
  user: req.user.id,
  name,
});

if (existingPlan) {
  return res.status(400).json({
    success: false,
    message: "You already have a workout plan with this name.",
  });
}

const uniqueDays = [...new Set(daysOfWeek)];

const workoutPlan = await WorkoutPlan.create({
  user: req.user.id,
  name,
  description,
  daysOfWeek: uniqueDays,
  exercises,
});

    res.status(201).json({
      success: true,
      message: "Workout plan created successfully.",
      workoutPlan,
    });

  } catch (error) {
    console.error("Create Workout Plan Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Workout Plans
export const getWorkoutPlans = async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find({
      user: req.user.id,
    })
   .populate(
  "exercises.exercise",
  "name muscleGroup equipment thumbnail"
)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workoutPlans.length,
      workoutPlans,
    });
  } catch (error) {
    console.error("Get Workout Plans Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Workout Plan By ID
export const getWorkoutPlanById = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate(
  "exercises.exercise",
  "name muscleGroup equipment thumbnail"
)

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found.",
      });
    }

    res.status(200).json({
      success: true,
      workoutPlan,
    });
  } catch (error) {
    console.error("Get Workout Plan Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getTodayWorkout = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    const workoutPlan = await WorkoutPlan.findOne({
      user: req.user.id,
      daysOfWeek: today,
    }).populate(
      "exercises.exercise",
      "name muscleGroup thumbnail"
    );

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: `No workout scheduled for ${today}.`,
      });
    }

    res.status(200).json({
      success: true,
      today,
      workoutPlan,
    });

  } catch (error) {
    console.error("Today's Workout Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Workout Plan
export const updateWorkoutPlan = async (req, res) => {
  try {
const {
  name,
  description,
  daysOfWeek,
  exercises,
} = req.body;

    const workoutPlan = await WorkoutPlan.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found.",
      });
    }

    // Validate exercise IDs if provided
    if (exercises && exercises.length > 0) {
      for (const item of exercises) {
        const exercise = await Exercise.findById(item.exercise);

        if (!exercise) {
          return res.status(404).json({
            success: false,
            message: `Exercise not found: ${item.exercise}`,
          });
        }
      }

      workoutPlan.exercises = exercises;
    }

    if (name) workoutPlan.name = name;
    if (description !== undefined) workoutPlan.description = description;
    
  if (daysOfWeek) {
  if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please select at least one workout day.",
    });
  }

  workoutPlan.daysOfWeek = [...new Set(daysOfWeek)];
}

    await workoutPlan.save();

    res.status(200).json({
      success: true,
      message: "Workout plan updated successfully.",
      workoutPlan,
    });

  } catch (error) {
    console.error("Update Workout Plan Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// Delete Workout Plan
export const deleteWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found.",
      });
    }

    await workoutPlan.deleteOne();

    res.status(200).json({
      success: true,
      message: "Workout plan deleted successfully.",
    });

  } catch (error) {
    console.error("Delete Workout Plan Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};