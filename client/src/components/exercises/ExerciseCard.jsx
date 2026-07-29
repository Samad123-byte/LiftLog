import { motion } from "framer-motion";
import { ArrowUpRight, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

function CardContent({ exercise, showArrow = true }) {
  return (
    <>
      <div className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-br from-steel to-carbon">
        {exercise.thumbnail ? (
          <img
            src={exercise.thumbnail}
            alt={exercise.name}
            className="h-full w-full object-cover grayscale-[35%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <span className="grid h-full place-items-center text-muted">
            <Dumbbell size={43} />
          </span>
        )}

        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-platinum backdrop-blur-md">
          {exercise.muscleGroup}
        </span>

        {showArrow && (
          <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-black/55 text-silver backdrop-blur-md transition sm:opacity-0 sm:group-hover:opacity-100">
            <ArrowUpRight size={17} />
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-bold text-platinum">
              {exercise.name}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {exercise.equipment} · {exercise.exerciseType}
            </p>
          </div>

          <span className="rounded-lg border border-white/10 bg-white/[.045] px-2 py-1 text-[10px] font-semibold text-silver">
            {exercise.difficulty}
          </span>
        </div>

        {!exercise.adminActions && (
          <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-silver">
            Open exercise detail
            <ArrowUpRight size={14} />
          </span>
        )}
      </div>
    </>
  );
}

export default function ExerciseCard({ exercise, admin = false, actions }) {
  const detailPath = admin
    ? `/admin/exercises/${exercise._id}/edit`
    : `/exercises/${exercise._id}`;

  if (!admin) {
    return (
      <motion.article layout whileHover={{ y: -7 }} className="h-full">
        <Link
          to={detailPath}
          className="glass-card chrome-border group block h-full overflow-hidden"
          aria-label={`Open ${exercise.name}`}
        >
          <CardContent exercise={exercise} />
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      whileHover={{ y: -7 }}
      className="glass-card chrome-border group overflow-hidden"
    >
      <Link to={detailPath}>
        <CardContent exercise={{ ...exercise, adminActions: true }} />
      </Link>

      {actions && (
        <div className="mx-4 mb-4 flex gap-2 border-t border-white/10 pt-4 sm:mx-5 sm:mb-5">
          {actions}
        </div>
      )}
    </motion.article>
  );
}
