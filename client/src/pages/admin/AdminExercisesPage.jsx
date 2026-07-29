import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { exerciseApi } from "../../api/exerciseApi";
import { getErrorMessage } from "../../api/http";
import ExerciseCard from "../../components/exercises/ExerciseCard";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useToast } from "../../context/ToastContext";

export default function AdminExercisesPage() {
  const toast = useToast();
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    exerciseApi
      .getAll()
      .then(({ data }) => setExercises(data.exercises || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return exercises.filter(
      (exercise) =>
        !query ||
        exercise.name.toLowerCase().includes(query) ||
        exercise.muscleGroup.toLowerCase().includes(query) ||
        exercise.equipment.toLowerCase().includes(query),
    );
  }, [exercises, search]);

  const remove = async () => {
    setDeleting(true);
    try {
      await exerciseApi.remove(selected._id);
      setExercises((current) => current.filter((exercise) => exercise._id !== selected._id));
      toast.success(`${selected.name} was deleted.`);
      setSelected(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete exercise."));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader label="Loading exercise catalogue" />;

  return (
    <div>
      <PageHeader
        kicker="Administrator library"
        title="Exercises"
        copy="Create, review, edit, and remove movements available to users."
        actions={
          <Link
            to="/admin/exercises/new"
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-platinum px-4 text-sm font-bold text-void"
          >
            <Plus size={17} />
            Create exercise
          </Link>
        }
      />

      <div className="glass-card mb-7 p-4">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            className="field pl-11"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search exercise name, muscle group, or equipment"
          />
        </label>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filtered.map((exercise) => (
          <ExerciseCard
            key={exercise._id}
            exercise={exercise}
            admin
            actions={
              <>
                <Link
                  to={`/admin/exercises/${exercise._id}/edit`}
                  className="focus-ring inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.045] text-xs font-bold text-silver transition hover:bg-white/[.09]"
                >
                  <Edit3 size={15} />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setSelected(exercise)}
                  className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </>
            }
          />
        ))}

        {!filtered.length && (
          <EmptyState
            title="No exercises found"
            copy={search ? "No catalogue entries match the current search." : "Create the first exercise for the shared library."}
          />
        )}
      </section>

      <ConfirmDialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onConfirm={remove}
        loading={deleting}
        title={`Delete ${selected?.name || "exercise"}?`}
        copy="Deleting an exercise may affect workout plans that reference it. Confirm only when the movement should no longer be available."
      />
    </div>
  );
}
