import PersonalRecord from "../models/PersonalRecord.js";


const checkPersonalRecord = async ({
    user,
    exercise,
    sets,
    workoutSession
}) => {

    try {

        // Find highest weight and reps from this workout
        let maxWeight = 0;
        let maxReps = 0;


        for (const set of sets) {

            if (set.weight > maxWeight) {
                maxWeight = set.weight;
                maxReps = set.reps;
            }

            else if (
                set.weight === maxWeight &&
                set.reps > maxReps
            ) {
                maxReps = set.reps;
            }

        }



        // Find existing PR

        let record = await PersonalRecord.findOne({
            user,
            exercise
        });



        // First time doing exercise

        if(!record){

            record = await PersonalRecord.create({

                user,
                exercise,
                bestWeight:maxWeight,
                bestReps:maxReps,
                workoutSession

            });


            return {
                newRecord:true,
                record
            };

        }



        let newRecord = false;



        // New heavier weight

        if(maxWeight > record.bestWeight){

            record.bestWeight = maxWeight;
            record.bestReps = maxReps;

            newRecord = true;

        }


        // Same weight but more reps

        else if(
            maxWeight === record.bestWeight &&
            maxReps > record.bestReps
        ){

            record.bestReps = maxReps;

            newRecord = true;

        }



        if(newRecord){

            record.workoutSession = workoutSession;
            record.achievedAt = Date.now();

            await record.save();

        }



        return {
            newRecord,
            record
        };



    } catch(error){

        console.log(
            "Personal Record Error:",
            error.message
        );

    }

};


export default checkPersonalRecord;