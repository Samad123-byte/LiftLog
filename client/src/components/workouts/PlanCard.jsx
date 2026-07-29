import { motion } from "framer-motion";
import {
  CalendarDays,
  Dumbbell,
  Pencil,
  Play,
  Timer,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  estimatePlanMinutes,
  uniqueMuscleGroups,
} from "../../utils/training";

export default function PlanCard({ plan, onDelete }) {
  const muscles = uniqueMuscleGroups(plan);
  const coverImage = plan.exercises?.find((item) => item.exercise?.thumbnail)?.exercise?.thumbnail;

  return (
    <motion.article
      whileHover={{ y: -7 }}
      className="glass-card chrome-border group overflow-hidden"
    >
      <div className="relative min-h-44 overflow-hidden border-b border-white/10 bg-gradient-to-br from-steel via-graphite to-carbon p-5">
        {coverImage && (
          <>
            <img
              src={coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover grayscale opacity-35 transition duration-500 group-hover:scale-105 group-hover:opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/80 to-transparent" />
          </>
        )}

        <div className="relative z-10 flex h-full min-h-32 flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-black/30 text-silver backdrop-blur-lg">
              <Dumbbell size={22} />
            </span>
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-silver backdrop-blur-lg">
              {plan.exercises?.length || 0} exercises
            </span>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-3xl font-extrabold tracking-[-.05em] text-platinum">
              {plan.name}
            </h2>
            <p className="mt-2 flex items-center gap-2 text-xs text-silver/75">
              <CalendarDays size={14} />
              {plan.daysOfWeek?.join(" • ") || "No days selected"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="min-h-12 text-sm leading-6 text-muted">
          {plan.description || "A focused training routine built for steady progress."}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {muscles.slice(0, 4).map((muscle) => (
            <span
              key={muscle}
              className="rounded-full border border-white/10 bg-white/[.045] px-3 py-1 text-[10px] font-semibold text-silver"
            >
              {muscle}
            </span>
          ))}
          {!muscles.length && (
            <span className="rounded-full border border-white/10 bg-white/[.045] px-3 py-1 text-[10px] font-semibold text-muted">
              Add exercise focus
            </span>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-muted">
          <Timer size={15} />
          Estimated {estimatePlanMinutes(plan)} min
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">
          <Link
            to={`/workout/${plan._id}`}
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-platinum px-4 text-sm font-bold text-void transition hover:-translate-y-0.5 hover:bg-white"
          >
            <Play size={17} fill="currentColor" />
            Start
          </Link>

          <Link
            to={`/plans/${plan._id}/edit`}
            className="focus-ring grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[.045] text-silver transition hover:bg-white/[.09] hover:text-platinum"
            aria-label={`Edit ${plan.name}`}
          >
            <Pencil size={17} />
          </Link>

          <button
            type="button"
            onClick={() => onDelete(plan)}
            className="focus-ring grid h-11 w-11 place-items-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
            aria-label={`Delete ${plan.name}`}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
