import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, Dumbbell, Plus, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { planApi } from "../../api/planApi";
import { sessionApi } from "../../api/sessionApi";
import { getErrorMessage } from "../../api/http";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import SetRow, { AddSetButton } from "../../components/workouts/SetRow";
import { useToast } from "../../context/ToastContext";

export default function StartWorkoutPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [plan, setPlan] = useState(null);
  const [workout, setWorkout] = useState([]);
  const [notes, setNotes] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [startedAt] = useState(Date.now());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    planApi
      .getById(planId)
      .then(({ data }) => {
        setPlan(data.workoutPlan);
        setWorkout(
          (data.workoutPlan.exercises || []).map((item) => ({
            exercise: item.exercise,
            targetReps: item.reps,
            restTime: item.restTime,
            sets: Array.from({ length: item.sets }, () => ({
              weight: "",
              reps: "",
              completed: false,
            })),
          })),
        );
      })
      .catch((error) => toast.error(getErrorMessage(error, "Unable to load workout.")))
      .finally(() => setLoading(false));
  }, [planId, toast]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  const completedSets = useMemo(
    () => workout.reduce((sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length, 0),
    [workout],
  );

  const totalSets = useMemo(
    () => workout.reduce((sum, exercise) => sum + exercise.sets.length, 0),
    [workout],
  );

  const updateSet = (exerciseIndex, setIndex, nextSet) => {
    setWorkout((current) =>
      current.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, indexSet) =>
                indexSet === setIndex ? nextSet : set,
              ),
            }
          : exercise,
      ),
    );
  };

  const addSet = (exerciseIndex) => {
    setWorkout((current) =>
      current.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              sets: [...exercise.sets, { weight: "", reps: "", completed: false }],
            }
          : exercise,
      ),
    );
  };

  const removeSet = (exerciseIndex, setIndex) => {
    setWorkout((current) =>
      current.map((exercise, index) =>
        index === exerciseIndex
          ? { ...exercise, sets: exercise.sets.filter((_, indexSet) => indexSet !== setIndex) }
          : exercise,
      ),
    );
  };

  const finish = async () => {
    const exercises = workout
      .map((item) => ({
        exercise: item.exercise?._id || item.exercise,
        sets: item.sets
          .filter((set) => set.completed && Number(set.reps) > 0)
          .map((set) => ({
            weight: Number(set.weight) || 0,
            reps: Number(set.reps),
          })),
      }))
      .filter((item) => item.sets.length);

    if (!exercises.length) {
      toast.error("Complete at least one set before finishing the workout.");
      return;
    }

    setSaving(true);
    try {
      const duration = Math.max(1, Math.round(elapsed / 60));
      const { data } = await sessionApi.create({
        workoutPlan: planId,
        exercises,
        duration,
        notes,
      });
      toast.success("Workout saved.");
      navigate("/workout-summary", {
        replace: true,
        state: {
          session: data.workoutSession,
          personalRecords: data.personalRecords || [],
          planName: plan?.name,
        },
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save workout."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Preparing your workout" />;
  if (!plan) return null;

  const timerText = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link to="/plans" className="focus-ring inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-muted transition hover:text-platinum">
          <ArrowLeft size={17} />
          Exit workout
        </Link>
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] px-4 py-2">
          <Clock3 size={18} className="text-silver" />
          <span className="font-display text-xl font-extrabold tracking-[-.03em]">{timerText}</span>
        </div>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[.08] to-transparent p-6 shadow-chrome sm:p-8">
        <p className="section-kicker">Workout in progress</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-.055em] sm:text-6xl">{plan.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{plan.description}</p>
        <div className="mt-6 flex items-center gap-3 text-sm text-silver">
          <CheckCircle2 size={18} />
          {completedSets} of {totalSets} sets completed
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[.06]">
          <div
            className="h-full rounded-full bg-chrome transition-all"
            style={{ width: `${totalSets ? (completedSets / totalSets) * 100 : 0}%` }}
          />
        </div>
      </section>

      <div className="mt-6 grid gap-5">
        {workout.map((item, exerciseIndex) => (
          <section key={item.exercise?._id || item.exercise} className="glass-card p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[.055] text-silver">
                {item.exercise?.thumbnail ? (
                  <img src={item.exercise.thumbnail} alt="" className="h-full w-full object-cover grayscale" />
                ) : (
                  <Dumbbell size={21} />
                )}
              </span>
              <div>
                <h2 className="font-display text-xl font-extrabold text-platinum">{item.exercise?.name || "Exercise"}</h2>
                <p className="mt-1 text-xs text-muted">Target {item.targetReps} reps · {item.restTime || 60}s rest</p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {item.sets.map((set, setIndex) => (
                <SetRow
                  key={setIndex}
                  set={set}
                  index={setIndex}
                  onChange={(nextSet) => updateSet(exerciseIndex, setIndex, nextSet)}
                  onRemove={() => removeSet(exerciseIndex, setIndex)}
                  canRemove={item.sets.length > 1}
                />
              ))}
            </div>

            <AddSetButton onClick={() => addSet(exerciseIndex)} />
          </section>
        ))}
      </div>

      <section className="glass-card mt-6 p-5 sm:p-6">
        <label>
          <span className="label">Workout notes</span>
          <textarea className="textarea-field" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Energy, technique notes, pain, progress, or anything to remember." />
        </label>
      </section>

      <div className="sticky bottom-20 z-20 mt-6 rounded-2xl border border-white/10 bg-carbon/90 p-3 shadow-chrome backdrop-blur-2xl lg:bottom-4">
        <Button loading={saving} onClick={finish} className="min-h-12 w-full">
          <Save size={18} />
          Finish and save workout
        </Button>
      </div>
    </div>
  );
}
