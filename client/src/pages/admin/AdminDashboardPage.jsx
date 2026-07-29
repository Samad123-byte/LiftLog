import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ClipboardList, Dumbbell, Layers3, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { exerciseApi } from "../../api/exerciseApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import StatCard from "../../components/common/StatCard";
import ExerciseCard from "../../components/exercises/ExerciseCard";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    exerciseApi
      .getAll()
      .then(({ data }) => setExercises(data.exercises || []))
      .finally(() => setLoading(false));
  }, []);

  const breakdown = useMemo(() => {
    return exercises.reduce((groups, exercise) => {
      groups[exercise.muscleGroup] = (groups[exercise.muscleGroup] || 0) + 1;
      return groups;
    }, {});
  }, [exercises]);

  if (loading) return <Loader label="Loading admin dashboard" />;

  const topMuscle = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      <PageHeader
        kicker="Exercise administration"
        title={`Welcome, ${user?.name?.split(" ")[0] || "Admin"}`}
        copy="Maintain a clean, accurate exercise library for every LiftLog user."
        actions={
          <Link
            to="/admin/exercises/new"
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-platinum px-4 text-sm font-bold text-void"
          >
            <PlusCircle size={17} />
            Create exercise
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Dumbbell} label="Total exercises" value={exercises.length} helper="Published movements in the shared library" />
        <StatCard icon={Layers3} label="Muscle groups" value={Object.keys(breakdown).length} helper="Body regions currently represented" />
        <StatCard icon={ClipboardList} label="Largest category" value={topMuscle?.[0] || "—"} helper={topMuscle ? `${topMuscle[1]} exercises in this category` : "Add the first exercise"} />
      </section>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_.72fr]">
        <section className="glass-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker">Recently added</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-.04em]">
                Latest library entries
              </h2>
            </div>
            <Link to="/admin/exercises" className="inline-flex items-center gap-2 text-sm font-bold text-silver">
              Manage all
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {exercises.slice(-4).reverse().map((exercise) => (
              <ExerciseCard key={exercise._id} exercise={exercise} admin />
            ))}
          </div>
        </section>

        <section className="glass-card p-5 sm:p-6">
          <p className="section-kicker">Library balance</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-.04em]">
            Muscle-group coverage
          </h2>
          <div className="mt-6 grid gap-4">
            {Object.entries(breakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([muscle, count]) => (
                <div key={muscle}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-silver">{muscle}</span>
                    <span className="text-muted">{count}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[.055]">
                    <div
                      className="h-full rounded-full bg-chrome"
                      style={{ width: `${Math.max(10, (count / Math.max(1, exercises.length)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
