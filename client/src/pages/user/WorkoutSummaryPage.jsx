import { Activity, ArrowRight, CalendarDays, Dumbbell, History, Medal } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import PersonalRecordBanner from "../../components/workouts/PersonalRecordBanner";
import { formatDuration, formatVolume } from "../../utils/format";

export default function WorkoutSummaryPage() {
  const { state } = useLocation();

  if (!state?.session) {
    return <Navigate to="/history" replace />;
  }

  const { session, personalRecords = [], planName } = state;

  return (
    <div className="mx-auto max-w-5xl">
      <section className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-white/15 bg-platinum text-void shadow-lg shadow-white/10">
          <Activity size={27} />
        </span>
        <p className="section-kicker mt-7">Workout complete</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-[-.065em] sm:text-7xl">
          Work saved.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
          {planName || "Your workout"} is now part of your training history.
        </p>
      </section>

      <section className="mt-9 grid gap-4 sm:grid-cols-3">
        {[
          [CalendarDays, "Duration", formatDuration(session.duration)],
          [Dumbbell, "Total sets", session.totalSets || 0],
          [Activity, "Volume", formatVolume(session.totalVolume)],
        ].map(([Icon, label, value]) => (
          <article key={label} className="glass-card p-5 text-center">
            <Icon className="mx-auto text-silver" size={22} />
            <strong className="mt-5 block font-display text-3xl font-extrabold tracking-[-.04em]">{value}</strong>
            <span className="mt-1 block text-xs text-muted">{label}</span>
          </article>
        ))}
      </section>

      <div className="mt-6">
        <PersonalRecordBanner records={personalRecords} />
      </div>

      {!personalRecords.length && (
        <section className="glass-card mt-6 p-6 text-center">
          <Medal className="mx-auto text-muted" size={27} />
          <h2 className="mt-4 font-display text-2xl font-bold">No new record this time.</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
            The session still counts. Progress is built from repeated quality work, not only record days.
          </p>
        </section>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Link to="/history" className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-platinum px-5 text-sm font-bold text-void">
          <History size={18} />
          View workout history
        </Link>
        <Link to="/dashboard" className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.045] px-5 text-sm font-bold text-platinum">
          Return to dashboard
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
