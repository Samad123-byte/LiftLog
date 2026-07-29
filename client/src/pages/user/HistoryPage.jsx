import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Dumbbell,
  History as HistoryIcon,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { sessionApi } from "../../api/sessionApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import {
  formatDate,
  formatDuration,
  formatVolume,
  monthYear,
} from "../../utils/format";

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionApi
      .getAll()
      .then(({ data }) => setSessions(data.workoutSessions || []))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    return sessions.reduce((groups, session) => {
      const key = monthYear(session.completedAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(session);
      return groups;
    }, {});
  }, [sessions]);

  if (loading) return <Loader label="Loading workout history" />;

  return (
    <div>
      <PageHeader
        kicker="Completed training"
        title="Workout History"
        copy="Review every completed routine, exercise count, duration, volume, and full set breakdown."
      />

      {!sessions.length ? (
        <EmptyState
          icon={HistoryIcon}
          title="No completed workouts yet"
          copy="Start a workout from one of your plans and the saved session will appear here."
          action={
            <Link
              to="/plans"
              className="inline-flex min-h-11 items-center rounded-xl bg-platinum px-4 text-sm font-bold text-void"
            >
              Open workout plans
            </Link>
          }
        />
      ) : (
        <div className="grid gap-9">
          {Object.entries(grouped).map(([month, items]) => (
            <section key={month}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-display text-2xl font-extrabold tracking-[-.04em]">
                  {month}
                </h2>
                <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs text-muted">
                  {items.length}
                </span>
              </div>

              <div className="grid gap-3">
                {items.map((session) => (
                  <Link
                    key={session._id}
                    to={`/history/${session._id}`}
                    className="focus-ring group rounded-3xl border border-white/10 bg-white/[.035] p-4 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[.055] sm:p-5"
                  >
                    <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[.055] text-silver">
                        <Activity size={21} />
                      </span>

                      <div className="min-w-0">
                        <strong className="block truncate font-display text-xl text-platinum">
                          {session.workoutPlan?.name || "Workout Session"}
                        </strong>
                        <span className="mt-1 flex items-center gap-2 text-xs text-muted">
                          <CalendarDays size={13} />
                          {formatDate(session.completedAt, { weekday: "short" })}
                        </span>
                      </div>

                      <ArrowRight
                        className="hidden text-muted transition group-hover:translate-x-1 group-hover:text-platinum sm:block"
                        size={19}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                      <span className="rounded-xl bg-black/15 p-3">
                        <small className="flex items-center gap-1.5 text-[10px] uppercase tracking-[.11em] text-muted">
                          <Dumbbell size={12} />
                          Exercises
                        </small>
                        <strong className="mt-1 block text-sm text-silver">
                          {session.exercises?.length || 0}
                        </strong>
                      </span>

                      <span className="rounded-xl bg-black/15 p-3">
                        <small className="flex items-center gap-1.5 text-[10px] uppercase tracking-[.11em] text-muted">
                          <Timer size={12} />
                          Duration
                        </small>
                        <strong className="mt-1 block text-sm text-silver">
                          {formatDuration(session.duration)}
                        </strong>
                      </span>

                      <span className="rounded-xl bg-black/15 p-3">
                        <small className="flex items-center gap-1.5 text-[10px] uppercase tracking-[.11em] text-muted">
                          <Activity size={12} />
                          Volume
                        </small>
                        <strong className="mt-1 block truncate text-sm text-silver">
                          {formatVolume(session.totalVolume)}
                        </strong>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
