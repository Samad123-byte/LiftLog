import PersonalRecord from "../models/PersonalRecord.js";


// @desc Get user's personal records
// @route GET /api/records
// @access Private
export const getMyRecords = async (req, res) => {
  try {
    const records = await PersonalRecord.find({
      user: req.user._id,
    })
      .populate("exercise", "name muscleGroup thumbnail")
      .populate("workoutSession", "completedAt workoutPlan")
      .sort({
        achievedAt: -1,
      });


    res.status(200).json({
      success: true,
      records,
    });

  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message,
    });
  }
};



// @desc Create or update personal record
// @route POST /api/records
// @access Private
export const updatePersonalRecord = async (req,res)=>{

  try {

    const {
      exercise,
      bestWeight,
      bestReps,
      workoutSession
    } = req.body;


    let record = await PersonalRecord.findOne({
      user:req.user._id,
      exercise
    });


    // if record already exists
    if(record){

      if(bestWeight > record.bestWeight){
        record.bestWeight = bestWeight;
      }


      if(bestReps > record.bestReps){
        record.bestReps = bestReps;
      }


      record.workoutSession = workoutSession;
      record.achievedAt = Date.now();


      await record.save();


    }else{

      // create new record

      record = await PersonalRecord.create({

        user:req.user._id,
        exercise,
        bestWeight,
        bestReps,
        workoutSession

      });

    }


    res.status(200).json({

      success:true,
      message:"Personal record updated",
      record

    });


  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};




// @desc Delete personal record
// @route DELETE /api/records/:id
// @access Private
export const deleteRecord = async(req,res)=>{

  try{


    const record = await PersonalRecord.findOne({
      _id:req.params.id,
      user:req.user._id
    });


    if(!record){

      return res.status(404).json({
        success:false,
        message:"Record not found"
      });

    }


    await record.deleteOne();


    res.status(200).json({

      success:true,
      message:"Record deleted"

    });



  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};