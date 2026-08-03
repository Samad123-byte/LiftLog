import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Dumbbell,
  Flame,
  History,
  Medal,
  Play,
  Scale,
  Target,
  Timer,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { planApi } from "../../api/planApi";
import { sessionApi } from "../../api/sessionApi";
import { recordApi } from "../../api/recordApi";
import { exerciseApi } from "../../api/exerciseApi";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";
import { formatDate, formatDuration, formatVolume } from "../../utils/format";
import {
  calculateCurrentStreak,
  estimatePlanMinutes,
  relativeWorkoutDate,
  uniqueMuscleGroups,
} from "../../utils/training";
import cbumImage from "../../assets/chris-bumstead.jpg";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState({
    today: null,
    upcoming: [],
    plans: [],
    sessions: [],
    records: [],
    exercises: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [today, upcoming, plans, sessions, records, exercises] = await Promise.allSettled([
        planApi.getToday(),
        planApi.getUpcoming(),
        planApi.getAll(),
        sessionApi.getAll(),
        recordApi.getAll(),
        exerciseApi.getAll(),
      ]);

      setData({
        today: today.status === "fulfilled" ? today.value.data.workoutPlan : null,
        upcoming: upcoming.status === "fulfilled" ? upcoming.value.data.upcoming || [] : [],
        plans: plans.status === "fulfilled" ? plans.value.data.workoutPlans || [] : [],
        sessions: sessions.status === "fulfilled" ? sessions.value.data.workoutSessions || [] : [],
        records: records.status === "fulfilled" ? records.value.data.records || [] : [],
        exercises: exercises.status === "fulfilled" ? exercises.value.data.exercises || [] : [],
      });
      setLoading(false);
    };

    load();
  }, []);

  const totalVolume = useMemo(
    () => data.sessions.reduce((sum, session) => sum + (Number(session.totalVolume) || 0), 0),
    [data.sessions],
  );

  const streak = useMemo(
    () => calculateCurrentStreak(data.sessions),
    [data.sessions],
  );

  const todayMuscles = useMemo(
    () => uniqueMuscleGroups(data.today),
    [data.today],
  );

  const lastWorkout = data.sessions[0];

  if (loading) return <Loader label="Building your dashboard" />;

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-carbon shadow-chrome">
        <div className="absolute inset-y-0 right-0 w-full sm:w-[58%]">
          <img
            src={cbumImage}
            alt=""
            className="h-full w-full object-cover object-top grayscale opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-black/10" />
        </div>

        <div className="relative z-10 min-h-[440px] max-w-3xl p-6 sm:p-9 lg:p-12">
          <p className="section-kicker">Today’s standard</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-6xl">
            Hello {user?.name?.split(" ")[0] || "Athlete"}{" "}
            <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-silver/70 sm:text-base">
            The plan is only a promise until the first working set. Make today visible.
          </p>

          {data.today ? (
            <div className="mt-8 max-w-2xl rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-muted">
                    Today’s workout
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-.045em] text-platinum">
                    {data.today.name}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.055] px-3 py-1.5 text-xs text-silver">
                  <Timer size={14} />
                  Estimated {estimatePlanMinutes(data.today)} min
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-[.16em] text-muted">
                    Exercises
                  </span>
                  <strong className="mt-2 block font-display text-2xl text-platinum">
                    {data.today.exercises?.length || 0}
                  </strong>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-[.16em] text-muted">
                    Focus
                  </span>
                  <strong className="mt-2 block truncate text-sm text-platinum">
                    {todayMuscles.length ? todayMuscles.join(" · ") : "Full-body training"}
                  </strong>
                </div>
              </div>

              <Link
                to={`/workout/${data.today._id}`}
                className="focus-ring mt-5 inline-flex min-h-12 w-full items-center justify-between rounded-xl bg-platinum px-5 text-sm font-bold text-void transition hover:-translate-y-0.5 hover:bg-white sm:w-auto sm:gap-5"
              >
                <span className="inline-flex items-center gap-2">
                  <Play size={17} fill="currentColor" />
                  Start workout
                </span>
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/plans/new"
                className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-xl bg-platinum px-5 text-sm font-bold text-void"
              >
                <CalendarDays size={18} />
                Build a workout plan
              </Link>
              <Link
                to="/exercises"
                className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[.055] px-5 text-sm font-bold text-platinum"
              >
                Browse exercises
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Flame}
          label="Current streak"
          value={`${streak} ${streak === 1 ? "Day" : "Days"}`}
          helper={streak ? "Keep the chain alive with your next session" : "Complete a session to begin"}
        />
        <StatCard
          icon={Scale}
          label="Current weight"
          value={user?.currentWeight ? `${user.currentWeight} kg` : "Not set"}
          helper="Update this anytime from your profile"
        />
        <StatCard
          icon={Target}
          label="Goal"
          value={
            user?.targetWeight
              ? `${user.targetWeight} kg`
              : user?.goal || "Not set"
          }
          helper={user?.goal || "Add a target weight and fitness goal"}
        />
        <StatCard
          icon={History}
          label="Last workout"
          value={lastWorkout?.workoutPlan?.name || "No sessions"}
          helper={
            lastWorkout
              ? `${relativeWorkoutDate(lastWorkout.completedAt)} · ${lastWorkout.exercises?.length || 0} exercises`
              : "Your latest completed session will appear here"
          }
        />
      </section>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <section className="glass-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker">Recent sessions</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-.04em]">
                Your latest work
              </h2>
            </div>
            <Link
              to="/history"
              className="text-sm font-bold text-silver transition hover:text-platinum"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {data.sessions.slice(0, 4).map((session, index) => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Link
                  to={`/history/${session._id}`}
                  className="focus-ring flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4 transition hover:border-white/20 hover:bg-white/[.055] sm:flex-row sm:items-center"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[.055] text-silver">
                    <History size={19} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm text-platinum">
                      {session.workoutPlan?.name || "Workout session"}
                    </strong>
                    <span className="mt-1 block text-xs text-muted">
                      {formatDate(session.completedAt)} · {session.exercises?.length || 0} exercises
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs sm:text-right">
                    <span>
                      <small className="block text-muted">Duration</small>
                      <strong className="text-silver">
                        {formatDuration(session.duration)}
                      </strong>
                    </span>
                    <span>
                      <small className="block text-muted">Volume</small>
                      <strong className="text-silver">
                        {formatVolume(session.totalVolume)}
                      </strong>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {!data.sessions.length && (
              <div className="rounded-2xl border border-dashed border-white/10 p-7 text-center">
                <p className="text-sm text-muted">
                  Complete a workout to begin your history.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="grid gap-6">
          <section className="glass-card p-5 sm:p-6">
            <p className="section-kicker">Up next</p>

            {data.upcoming.length ? (
              <div className="mt-3 grid gap-2.5">
                {data.upcoming.map((item, index) => (
                  <Link
                    key={`${item.workoutPlan?._id}-${item.day}`}
                    to={`/workout/${item.workoutPlan?._id}`}
                    className="focus-ring flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3 transition hover:border-white/20 hover:bg-white/[.055]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-platinum">
                        {item.workoutPlan?.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {item.day} ·{" "}
                        {item.workoutPlan?.exercises?.length || 0} exercises
                      </p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[.055] px-3 py-1 text-[11px] font-semibold text-silver">
                      <CalendarDays size={13} />
                      {item.daysAway === 1 ? "Tomorrow" : `In ${item.daysAway}d`}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <>
                <p className="mt-3 text-sm text-muted">
                  No upcoming workout scheduled yet.
                </p>
                <Link
                  to="/plans/new"
                  className="focus-ring mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/[.055] px-4 text-xs font-bold text-platinum transition hover:border-white/25 hover:bg-white/[.08]"
                >
                  Build a workout plan
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </section>

          <section className="glass-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-gold/20 bg-gold/10 text-[#e8c57c]">
                <Trophy size={20} />
              </span>
              <div>
                <p className="section-kicker">Lifetime volume</p>
                <strong className="mt-1 block font-display text-3xl font-extrabold tracking-[-.04em]">
                  {formatVolume(totalVolume)}
                </strong>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center">
              <div>
                <strong className="block text-lg text-platinum">{data.plans.length}</strong>
                <span className="text-[10px] uppercase tracking-[.12em] text-muted">Plans</span>
              </div>
              <div>
                <strong className="block text-lg text-platinum">{data.records.length}</strong>
                <span className="text-[10px] uppercase tracking-[.12em] text-muted">Records</span>
              </div>
              <div>
                <strong className="block text-lg text-platinum">{data.exercises.length}</strong>
                <span className="text-[10px] uppercase tracking-[.12em] text-muted">Exercises</span>
              </div>
            </div>
          </section>

          <section className="glass-card p-5 sm:p-6">
            <p className="section-kicker">Quick actions</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {[
                [Play, "Start workout", "/plans"],
                [CalendarDays, "Workout plans", "/plans"],
                [History, "Workout history", "/history"],
                [Medal, "Personal records", "/records"],
              ].map(([Icon, label, to]) => (
                <Link
                  key={label}
                  to={to}
                  className="focus-ring flex min-h-12 items-center justify-between rounded-2xl border border-white/10 bg-white/[.03] px-4 text-sm font-semibold text-silver transition hover:border-white/20 hover:bg-white/[.06] hover:text-platinum"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {label}
                  </span>
                  <ArrowRight size={17} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}