import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  Gauge,
  Layers3,
  Lightbulb,
  PlayCircle,
  Target,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { exerciseApi } from "../../api/exerciseApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import {
  getYouTubeEmbedUrl,
  splitGuidance,
} from "../../utils/training";

export default function ExerciseDetailPage() {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    exerciseApi
      .getById(id)
      .then(({ data }) => setExercise(data.exercise))
      .finally(() => setLoading(false));
  }, [id]);

  const videoEmbed = useMemo(
    () => getYouTubeEmbedUrl(exercise?.videoUrl),
    [exercise?.videoUrl],
  );

  const mistakes = useMemo(
    () => splitGuidance(exercise?.commonMistakes),
    [exercise?.commonMistakes],
  );

  const tips = useMemo(
    () => splitGuidance(exercise?.tips),
    [exercise?.tips],
  );

  if (loading) return <Loader label="Loading exercise" />;
  if (!exercise) return <EmptyState title="Exercise not found" />;

  return (
    <div>
      <Link
        to="/exercises"
        className="focus-ring mb-6 inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-muted transition hover:text-platinum"
      >
        <ArrowLeft size={17} />
        Exercise library
      </Link>

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-carbon shadow-chrome">
        <div className="grid lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative min-h-[360px] bg-gradient-to-br from-steel to-carbon lg:min-h-[650px]">
            {exercise.thumbnail ? (
              <img
                src={exercise.thumbnail}
                alt={exercise.name}
                className="absolute inset-0 h-full w-full object-cover grayscale-[20%]"
              />
            ) : (
              <span className="absolute inset-0 grid place-items-center text-muted">
                <Dumbbell size={64} />
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-black/10 lg:bg-gradient-to-r lg:from-transparent lg:to-carbon" />
          </div>

          <div className="p-6 sm:p-9 lg:p-12">
            <p className="section-kicker">{exercise.muscleGroup}</p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-6xl">
              {exercise.name}
            </h1>
            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-muted sm:text-base">
              {exercise.instructions}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                [Target, "Primary muscle", exercise.muscleGroup],
                [
                  Layers3,
                  "Secondary muscles",
                  exercise.secondaryMuscles?.length
                    ? exercise.secondaryMuscles.join(", ")
                    : "Not specified",
                ],
                [Dumbbell, "Equipment", exercise.equipment],
                [Gauge, "Difficulty", exercise.difficulty],
              ].map(([Icon, label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[.035] p-4"
                >
                  <Icon size={19} className="text-silver" />
                  <span className="mt-5 block text-[10px] uppercase tracking-[.16em] text-muted">
                    {label}
                  </span>
                  <strong className="mt-1 block text-sm text-platinum">
                    {value}
                  </strong>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[.035] p-4">
              <span className="text-[10px] uppercase tracking-[.16em] text-muted">
                Exercise type
              </span>
              <strong className="mt-1 block text-sm text-platinum">
                {exercise.exerciseType}
              </strong>
            </div>

            {exercise.videoUrl && !videoEmbed && (
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[.055] px-4 text-sm font-bold text-platinum transition hover:bg-white/[.09]"
              >
                <PlayCircle size={18} />
                Watch demonstration
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <div className="grid gap-6">
          <section className="glass-card p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[.055] text-silver">
                <CheckCircle2 size={20} />
              </span>
              <div>
                <p className="section-kicker">How to perform it</p>
                <h2 className="mt-1 font-display text-2xl font-extrabold">
                  Instructions
                </h2>
              </div>
            </div>

            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted sm:text-base">
              {exercise.instructions}
            </p>
          </section>

          <section className="glass-card border-red-500/10 p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-red-500/15 bg-red-500/10 text-red-300">
                <AlertTriangle size={20} />
              </span>
              <div>
                <p className="section-kicker">Technique awareness</p>
                <h2 className="mt-1 font-display text-2xl font-extrabold">
                  Common mistakes
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {(mistakes.length
                ? mistakes
                : ["No common mistakes have been added by the administrator yet."]
              ).map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4"
                >
                  <span className="mt-0.5 text-xs font-bold text-red-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="m-0 text-sm leading-6 text-muted">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-6">
          {videoEmbed ? (
            <section className="glass-card overflow-hidden p-3">
              <div className="aspect-video overflow-hidden rounded-2xl bg-black">
                <iframe
                  src={videoEmbed}
                  title={`${exercise.name} demonstration`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-3">
                <p className="section-kicker">Video demonstration</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Watch the movement, then compare the setup and range of motion with the written instructions.
                </p>
              </div>
            </section>
          ) : (
            <section className="glass-card grid min-h-64 place-items-center p-6 text-center">
              <div>
                <PlayCircle className="mx-auto text-muted" size={34} />
                <h2 className="mt-4 font-display text-xl font-bold">
                  Video not added yet
                </h2>
                <p className="mt-2 text-sm text-muted">
                   No video demonstration is available for this exercise yet.
                </p>
              </div>
            </section>
          )}

          <section className="glass-card border-emerald-400/10 p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                <Lightbulb size={20} />
              </span>
              <div>
                <p className="section-kicker">Better execution</p>
                <h2 className="mt-1 font-display text-2xl font-extrabold">
                  Coaching tips
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {(tips.length
                ? tips
                : ["No coaching tips have been added by the administrator yet."]
              ).map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 flex-none text-emerald-300"
                  />
                  <p className="m-0 text-sm leading-6 text-muted">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
