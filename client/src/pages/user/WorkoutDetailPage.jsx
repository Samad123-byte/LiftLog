import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Dumbbell,
  Flame,
  Medal,
  Repeat2,
  Trophy,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { sessionApi } from "../../api/sessionApi";
import { recordApi } from "../../api/recordApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import {
  formatDate,
  formatDuration,
  formatVolume,
} from "../../utils/format";
import {
  estimateCalories,
  getExerciseId,
} from "../../utils/training";

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      sessionApi.getById(id),
      recordApi.getAll(),
    ]).then(([sessionResult, recordResult]) => {
      if (sessionResult.status === "fulfilled") {
        setSession(sessionResult.value.data.workoutSession);
      }

      if (recordResult.status === "fulfilled") {
        setRecords(recordResult.value.data.records || []);
      }

      setLoading(false);
    });
  }, [id]);

  const recordExerciseIds = useMemo(() => {
    return new Set(
      records
        .filter((record) => getExerciseId(record.workoutSession) === id)
        .map((record) => getExerciseId(record.exercise)),
    );
  }, [records, id]);

  const calories = estimateCalories(session?.duration, user?.currentWeight);

  if (loading) return <Loader label="Loading workout details" />;
  if (!session) return <EmptyState title="Workout not found" />;

  return (
    <div>
      <Link
        to="/history"
        className="focus-ring mb-6 inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-muted transition hover:text-platinum"
      >
        <ArrowLeft size={17} />
        Workout history
      </Link>

      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[.08] to-transparent p-6 shadow-chrome sm:p-9">
        <p className="section-kicker">
          {formatDate(session.completedAt, { weekday: "long" })}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-.055em] sm:text-6xl">
          {session.workoutPlan?.name || "Workout session"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          {session.workoutPlan?.description}
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [Activity, "Duration", formatDuration(session.duration)],
            [Dumbbell, "Volume", formatVolume(session.totalVolume)],
            [Repeat2, "Sets / Reps", `${session.totalSets || 0} / ${session.totalReps || 0}`],
            [Flame, "Calories burned", calories ? `≈${calories} kcal` : "Add weight"],
          ].map(([Icon, label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <Icon size={18} className="text-silver" />
              <strong className="mt-5 block text-xl text-platinum">{value}</strong>
              <span className="text-xs text-muted">{label}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-muted">
          Calorie burn is an estimate based on workout duration and your current profile weight.
        </p>
      </section>

      <div className="mt-6 grid gap-4">
        {session.exercises?.map((item) => {
          const isRecord = recordExerciseIds.has(getExerciseId(item.exercise));

          return (
            <section
              key={getExerciseId(item.exercise)}
              className={`glass-card p-5 sm:p-6 ${
                isRecord ? "!border-gold/25 bg-gradient-to-br from-gold/[.08] to-white/[.025]" : ""
              }`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[.055] text-silver">
                  {item.exercise?.thumbnail ? (
                    <img
                      src={item.exercise.thumbnail}
                      alt=""
                      className="h-full w-full object-cover grayscale"
                    />
                  ) : (
                    <Dumbbell size={20} />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-extrabold">
                    {item.exercise?.name || "Exercise"}
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    {item.exercise?.muscleGroup} · {item.exercise?.equipment}
                  </p>
                </div>

                {isRecord && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#f0cf8c]">
                    <Trophy size={14} />
                    PR · Yes
                  </span>
                )}
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-3 bg-white/[.055] px-4 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-muted">
                  <span>Set</span>
                  <span>Weight</span>
                  <span>Reps</span>
                </div>

                {item.sets.map((set, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 border-t border-white/10 px-4 py-3 text-sm"
                  >
                    <span className="text-muted">{index + 1}</span>
                    <strong className="text-platinum">{set.weight} kg</strong>
                    <strong className="text-platinum">{set.reps}</strong>
                  </div>
                ))}
              </div>

              {isRecord && (
                <div className="mt-4 flex items-center gap-2 text-xs text-[#f0cf8c]">
                  <Medal size={15} />
                  A personal record from this exercise was saved in this session.
                </div>
              )}
            </section>
          );
        })}
      </div>

      {session.notes && (
        <section className="glass-card mt-6 p-5 sm:p-6">
          <p className="section-kicker">Workout notes</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">
            {session.notes}
          </p>
        </section>
      )}
    </div>
  );
}
