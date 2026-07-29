import WorkoutSession from "../models/WorkoutSession.js";
import WorkoutPlan from "../models/WorkoutPlan.js";
import Exercise from "../models/Exercise.js";
import checkPersonalRecord from "../utils/checkPersonalRecord.js";

// Create Workout Session
export const createWorkoutSession = async (req, res) => {
  try {
    const { workoutPlan, exercises, duration, notes } = req.body;

    // Validate workout plan
    const plan = await WorkoutPlan.findById(workoutPlan);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found.",
      });
    }

    // Validate exercises
    for (const item of exercises) {
      const exercise = await Exercise.findById(item.exercise);

      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: `Exercise not found: ${item.exercise}`,
        });
      }
    }

    let totalVolume = 0;
let totalSets = 0;
let totalReps = 0;

for (const exercise of exercises) {
  for (const set of exercise.sets) {
    totalVolume += set.weight * set.reps;
    totalSets += 1;
    totalReps += set.reps;
  }
}

 const workoutSession = await WorkoutSession.create({
  user: req.user.id,
  workoutPlan,
  exercises,
  duration,
  notes,
  totalVolume,
  totalSets,
  totalReps,
});

let personalRecords = [];

for (const exercise of exercises) {


  const result = await checkPersonalRecord({

    user:req.user.id,

    exercise:exercise.exercise,

    sets:exercise.sets,

    workoutSession:workoutSession._id

  });


  if(result?.newRecord){

    personalRecords.push(result.record);

  }

}

res.status(201).json({

 success:true,

 message:"Workout session saved successfully.",

 workoutSession,

 personalRecords

});

  } catch (error) {
    console.error("Create Workout Session Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Workout Sessions
export const getWorkoutSessions = async (req, res) => {
  try {
    const workoutSessions = await WorkoutSession.find({
      user: req.user.id,
    })
      .populate("workoutPlan", "name")
      .populate("exercises.exercise", "name muscleGroup thumbnail")
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: workoutSessions.length,
      workoutSessions,
    });

  } catch (error) {
    console.error("Get Workout Sessions Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Workout Session By ID
export const getWorkoutSessionById = async (req, res) => {
  try {
    const workoutSession = await WorkoutSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    })
      .populate("workoutPlan", "name description")
      .populate(
        "exercises.exercise",
        "name muscleGroup equipment difficulty thumbnail"
      );

    if (!workoutSession) {
      return res.status(404).json({
        success: false,
        message: "Workout session not found.",
      });
    }

    res.status(200).json({
      success: true,
      workoutSession,
    });

  } catch (error) {
    console.error("Get Workout Session Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};