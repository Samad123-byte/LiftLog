import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, GripVertical, Plus, Search, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { exerciseApi } from "../../api/exerciseApi";
import { planApi } from "../../api/planApi";
import { getErrorMessage } from "../../api/http";
import { daysOfWeek } from "../../constants/app";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../context/ToastContext";

export default function PlanFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    daysOfWeek: [],
    exercises: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const exerciseRequest = exerciseApi.getAll();
        const planRequest = editing ? planApi.getById(id) : null;
        const exerciseResponse = await exerciseRequest;
        setExercises(exerciseResponse.data.exercises || []);

        if (planRequest) {
          const { data } = await planRequest;
          setForm({
            name: data.workoutPlan.name || "",
            description: data.workoutPlan.description || "",
            daysOfWeek: data.workoutPlan.daysOfWeek || [],
            exercises: (data.workoutPlan.exercises || []).map((item, index) => ({
              exercise: item.exercise?._id || item.exercise,
              exerciseData: item.exercise,
              sets: item.sets,
              reps: item.reps,
              restTime: item.restTime || 60,
              order: item.order ?? index,
            })),
          });
        }
      } catch (error) {
        toast.error(getErrorMessage(error, "Unable to load plan."));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [editing, id, toast]);

  const available = useMemo(() => {
    const selectedIds = new Set(form.exercises.map((item) => item.exercise));
    const query = search.toLowerCase().trim();
    return exercises.filter(
      (exercise) =>
        !selectedIds.has(exercise._id) &&
        (!query ||
          exercise.name.toLowerCase().includes(query) ||
          exercise.muscleGroup.toLowerCase().includes(query)),
    );
  }, [exercises, form.exercises, search]);

  const toggleDay = (day) => {
    setForm((current) => ({
      ...current,
      daysOfWeek: current.daysOfWeek.includes(day)
        ? current.daysOfWeek.filter((item) => item !== day)
        : [...current.daysOfWeek, day],
    }));
  };

  const addExercise = (exercise) => {
    setForm((current) => ({
      ...current,
      exercises: [
        ...current.exercises,
        {
          exercise: exercise._id,
          exerciseData: exercise,
          sets: 3,
          reps: "10",
          restTime: 60,
          order: current.exercises.length,
        },
      ],
    }));
  };

  const updateExercise = (index, updates) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item,
      ),
    }));
  };

  const removeExercise = (index) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, order) => ({ ...item, order })),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.daysOfWeek.length) {
      toast.error("Select at least one training day.");
      return;
    }
    if (!form.exercises.length) {
      toast.error("Add at least one exercise.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        daysOfWeek: form.daysOfWeek,
        exercises: form.exercises.map((item, index) => ({
          exercise: item.exercise,
          sets: Number(item.sets),
          reps: String(item.reps),
          restTime: Number(item.restTime),
          order: index,
        })),
      };

      if (editing) {
        await planApi.update(id, payload);
        toast.success("Workout plan updated.");
      } else {
        await planApi.create(payload);
        toast.success("Workout plan created.");
      }
      navigate("/plans");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save workout plan."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading plan builder" />;

  return (
    <div>
      <Link to="/plans" className="focus-ring mb-6 inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-muted transition hover:text-platinum">
        <ArrowLeft size={17} />
        Workout plans
      </Link>

      <PageHeader
        kicker={editing ? "Edit routine" : "Build a routine"}
        title={editing ? "Update Workout Plan" : "Create Workout Plan"}
        copy="Choose days, add exercises, and define the structure you want to follow."
      />

      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <div className="grid gap-6">
          <section className="glass-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-platinum">Plan details</h2>
            <div className="mt-5 grid gap-5">
              <label>
                <span className="label">Plan name</span>
                <input
                  className="field"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Push Day"
                />
              </label>
              <label>
                <span className="label">Description</span>
                <textarea
                  className="textarea-field"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Upper-body pushing strength and hypertrophy."
                />
              </label>
            </div>
          </section>

          <section className="glass-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-platinum">Training days</h2>
            <p className="mt-2 text-sm text-muted">Select every day this plan should appear as today’s workout.</p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
              {daysOfWeek.map((day) => {
                const active = form.daysOfWeek.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`focus-ring min-h-11 rounded-xl border text-xs font-bold transition ${
                      active
                        ? "border-white/20 bg-platinum text-void"
                        : "border-white/10 bg-white/[.035] text-muted hover:text-platinum"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="glass-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-platinum">Selected exercises</h2>
                <p className="mt-1 text-sm text-muted">{form.exercises.length} movements in this routine</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {form.exercises.map((item, index) => (
                <div key={`${item.exercise}-${index}`} className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
                  <div className="flex items-start gap-3">
                    <GripVertical className="mt-1 flex-none text-muted/50" size={18} />
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-sm text-platinum">
                        {item.exerciseData?.name || exercises.find((exercise) => exercise._id === item.exercise)?.name || "Exercise"}
                      </strong>
                      <span className="mt-1 block text-xs text-muted">
                        {item.exerciseData?.muscleGroup || exercises.find((exercise) => exercise._id === item.exercise)?.muscleGroup}
                      </span>
                    </div>
                    <button type="button" onClick={() => removeExercise(index)} className="grid h-9 w-9 place-items-center rounded-xl text-red-300/70 transition hover:bg-red-500/10 hover:text-red-300">
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <label>
                      <span className="label !text-[9px]">Sets</span>
                      <input className="field !px-3" type="number" min="1" value={item.sets} onChange={(event) => updateExercise(index, { sets: event.target.value })} />
                    </label>
                    <label>
                      <span className="label !text-[9px]">Reps</span>
                      <input className="field !px-3" value={item.reps} onChange={(event) => updateExercise(index, { reps: event.target.value })} placeholder="8-12" />
                    </label>
                    <label>
                      <span className="label !text-[9px]">Rest sec</span>
                      <input className="field !px-3" type="number" min="0" value={item.restTime} onChange={(event) => updateExercise(index, { restTime: event.target.value })} />
                    </label>
                  </div>
                </div>
              ))}

              {!form.exercises.length && (
                <div className="rounded-2xl border border-dashed border-white/10 p-7 text-center text-sm text-muted">
                  Add exercises from the library panel.
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <section className="glass-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-platinum">Exercise library</h2>
            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input className="field pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search movements" />
            </div>

            <div className="custom-scrollbar mt-4 grid max-h-[620px] gap-2 overflow-y-auto pr-1">
              {available.map((exercise) => (
                <button
                  key={exercise._id}
                  type="button"
                  onClick={() => addExercise(exercise)}
                  className="focus-ring flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3 text-left transition hover:border-white/20 hover:bg-white/[.06]"
                >
                  <span className="grid h-11 w-11 flex-none place-items-center overflow-hidden rounded-xl bg-steel text-muted">
                    {exercise.thumbnail ? <img src={exercise.thumbnail} alt="" className="h-full w-full object-cover grayscale" /> : <Plus size={18} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-sm text-platinum">{exercise.name}</strong>
                    <small className="mt-1 block truncate text-xs text-muted">{exercise.muscleGroup} · {exercise.equipment}</small>
                  </span>
                  <Plus size={17} className="text-silver" />
                </button>
              ))}

              {!available.length && (
                <EmptyState title="No more exercises" copy="Every matching exercise has already been selected." />
              )}
            </div>
          </section>

          <Button type="submit" loading={saving} className="mt-4 min-h-12 w-full">
            {editing ? "Save changes" : "Create workout plan"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
