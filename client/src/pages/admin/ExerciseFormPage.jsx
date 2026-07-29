import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Save,
  UploadCloud,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { exerciseApi } from "../../api/exerciseApi";
import { getErrorMessage } from "../../api/http";
import {
  difficultyOptions,
  equipmentOptions,
  exerciseTypeOptions,
  muscleGroups,
} from "../../constants/app";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastContext";

const emptyForm = {
  name: "",
  muscleGroup: "",
  secondaryMuscles: [],
  equipment: "",
  difficulty: "",
  exerciseType: "",
  instructions: "",
  commonMistakes: "",
  tips: "",
  videoUrl: "",
};

export default function ExerciseFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const fileRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [thumbnail, setThumbnail] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;

    exerciseApi
      .getById(id)
      .then(({ data }) => {
        const exercise = data.exercise;
        setForm({
          name: exercise.name || "",
          muscleGroup: exercise.muscleGroup || "",
          secondaryMuscles: exercise.secondaryMuscles || [],
          equipment: exercise.equipment || "",
          difficulty: exercise.difficulty || "",
          exerciseType: exercise.exerciseType || "",
          instructions: exercise.instructions || "",
          commonMistakes: exercise.commonMistakes || "",
          tips: exercise.tips || "",
          videoUrl: exercise.videoUrl || "",
        });
        setThumbnail(exercise.thumbnail || "");
      })
      .catch((error) =>
        toast.error(getErrorMessage(error, "Unable to load exercise.")),
      )
      .finally(() => setLoading(false));
  }, [editing, id, toast]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const toggleSecondaryMuscle = (muscle) => {
    setForm((current) => ({
      ...current,
      secondaryMuscles: current.secondaryMuscles.includes(muscle)
        ? current.secondaryMuscles.filter((item) => item !== muscle)
        : [...current.secondaryMuscles, muscle],
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        payload.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : value,
        );
      });

      if (file) payload.append("thumbnail", file);

      if (editing) {
        await exerciseApi.update(id, payload);
        toast.success("Exercise updated.");
      } else {
        await exerciseApi.create(payload);
        toast.success("Exercise created.");
      }

      navigate("/admin/exercises");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save exercise."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading exercise editor" />;

  const activeImage = preview || thumbnail;

  return (
    <div>
      <Link
        to="/admin/exercises"
        className="focus-ring mb-6 inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-muted transition hover:text-platinum"
      >
        <ArrowLeft size={17} />
        Exercises
      </Link>

      <PageHeader
        kicker={editing ? "Update catalogue entry" : "New catalogue entry"}
        title={editing ? "Edit Exercise" : "Create Exercise"}
        copy="Add the movement details, technique guidance, and media users need before including it in a plan."
      />

      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="glass-card p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="label">Exercise name</span>
              <input
                className="field"
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Bench Press"
              />
            </label>

            <label>
              <span className="label">Primary muscle</span>
              <select
                className="select-field"
                required
                value={form.muscleGroup}
                onChange={(event) =>
                  setForm({ ...form, muscleGroup: event.target.value })
                }
              >
                <option value="">Select muscle group</option>
                {muscleGroups.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="label">Equipment</span>
              <select
                className="select-field"
                required
                value={form.equipment}
                onChange={(event) =>
                  setForm({ ...form, equipment: event.target.value })
                }
              >
                <option value="">Select equipment</option>
                {equipmentOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="label">Difficulty</span>
              <select
                className="select-field"
                required
                value={form.difficulty}
                onChange={(event) =>
                  setForm({ ...form, difficulty: event.target.value })
                }
              >
                <option value="">Select difficulty</option>
                {difficultyOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="label">Exercise type</span>
              <select
                className="select-field"
                required
                value={form.exerciseType}
                onChange={(event) =>
                  setForm({ ...form, exerciseType: event.target.value })
                }
              >
                <option value="">Select type</option>
                {exerciseTypeOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <fieldset className="sm:col-span-2">
              <legend className="label">Secondary muscles</legend>
              <div className="flex flex-wrap gap-2">
                {muscleGroups
                  .filter((muscle) => muscle !== form.muscleGroup)
                  .map((muscle) => {
                    const active = form.secondaryMuscles.includes(muscle);

                    return (
                      <button
                        key={muscle}
                        type="button"
                        onClick={() => toggleSecondaryMuscle(muscle)}
                        className={`focus-ring min-h-10 rounded-xl border px-3 text-xs font-semibold transition ${
                          active
                            ? "border-white/20 bg-platinum text-void"
                            : "border-white/10 bg-white/[.035] text-muted hover:text-platinum"
                        }`}
                      >
                        {muscle}
                      </button>
                    );
                  })}
              </div>
            </fieldset>

            <label className="sm:col-span-2">
              <span className="label">Video URL</span>
              <input
                className="field"
                type="url"
                value={form.videoUrl}
                onChange={(event) =>
                  setForm({ ...form, videoUrl: event.target.value })
                }
                placeholder="https://youtube.com/..."
              />
            </label>

            <label className="sm:col-span-2">
              <span className="label">Description and instructions</span>
              <textarea
                className="textarea-field min-h-48"
                required
                value={form.instructions}
                onChange={(event) =>
                  setForm({ ...form, instructions: event.target.value })
                }
                placeholder="Explain setup, execution, breathing, range of motion, and key technique points."
              />
            </label>

            <label className="sm:col-span-2">
              <span className="label">Common mistakes</span>
              <textarea
                className="textarea-field min-h-36"
                value={form.commonMistakes}
                onChange={(event) =>
                  setForm({ ...form, commonMistakes: event.target.value })
                }
                placeholder={"Add one mistake per line.\nFlaring the elbows too wide\nBouncing the bar from the chest"}
              />
            </label>

            <label className="sm:col-span-2">
              <span className="label">Coaching tips</span>
              <textarea
                className="textarea-field min-h-36"
                value={form.tips}
                onChange={(event) =>
                  setForm({ ...form, tips: event.target.value })
                }
                placeholder={"Add one tip per line.\nKeep the shoulder blades retracted\nDrive the feet into the floor"}
              />
            </label>
          </div>
        </section>

        <aside className="grid gap-4 xl:sticky xl:top-6 xl:self-start">
          <section className="glass-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold">Exercise image</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              JPG, PNG, or WebP. Maximum file size is controlled by the backend at 5 MB.
            </p>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="focus-ring mt-5 grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[.03] text-muted transition hover:border-white/25 hover:bg-white/[.055]"
            >
              {activeImage ? (
                <img
                  src={activeImage}
                  alt="Exercise preview"
                  className="h-full w-full object-cover grayscale-[20%]"
                />
              ) : (
                <span className="text-center">
                  <ImagePlus className="mx-auto" size={31} />
                  <strong className="mt-3 block text-sm text-silver">
                    Choose an exercise image
                  </strong>
                  <small className="mt-1 block text-xs text-muted">
                    Click to browse files
                  </small>
                </span>
              )}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) =>
                setFile(event.target.files?.[0] || null)
              }
            />

            <div className="mt-3 flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => fileRef.current?.click()}
              >
                <UploadCloud size={16} />
                Select image
              </Button>

              {(preview || file) && (
                <Button variant="danger" onClick={() => setFile(null)}>
                  <X size={16} />
                </Button>
              )}
            </div>
          </section>

          <Button
            type="submit"
            loading={saving}
            className="min-h-12 w-full"
          >
            <Save size={17} />
            {editing ? "Save exercise" : "Create exercise"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
