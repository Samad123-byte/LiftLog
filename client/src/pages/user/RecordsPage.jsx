import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Medal,
  Repeat2,
  Scale,
  TrendingUp,
  Trash2,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { recordApi } from "../../api/recordApi";
import { sessionApi } from "../../api/sessionApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { formatDate } from "../../utils/format";
import {
  getPreviousRecord,
  recordProgress,
} from "../../utils/training";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../api/http";

export default function RecordsPage() {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      recordApi.getAll(),
      sessionApi.getAll(),
    ]).then(([recordResult, sessionResult]) => {
      if (recordResult.status === "fulfilled") {
        setRecords(recordResult.value.data.records || []);
      }

      if (sessionResult.status === "fulfilled") {
        setSessions(sessionResult.value.data.workoutSessions || []);
      }

      setLoading(false);
    });
  }, []);

  const decoratedRecords = useMemo(
    () =>
      records.map((record) => {
        const previous = getPreviousRecord(record, sessions);
        return {
          ...record,
          previous,
          progress: recordProgress(record, previous),
        };
      }),
    [records, sessions],
  );

  const remove = async () => {
    setDeleting(true);
    try {
      await recordApi.remove(selected._id);
      setRecords((current) =>
        current.filter((record) => record._id !== selected._id),
      );
      toast.success("Personal record removed.");
      setSelected(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete record."));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader label="Loading personal records" />;

  return (
    <div>
      <PageHeader
        kicker="Highest standards reached"
        title="Personal Records"
        copy="See the weight, best reps, achievement date, and the exact improvement over your previous best."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {decoratedRecords.map((record, index) => (
          <article
            key={record._id}
            className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/15 via-white/[.03] to-transparent p-5 shadow-panel sm:p-6"
          >
            <Trophy className="absolute right-5 top-5 text-gold/45" size={38} />

            <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#f0cf8c]">
              <Medal size={13} />
              Record {String(index + 1).padStart(2, "0")}
            </span>

            <h2 className="mt-7 pr-10 font-display text-2xl font-extrabold tracking-[-.04em]">
              {record.exercise?.name || "Exercise"}
            </h2>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-gold/15 bg-black/15 p-3">
                <Scale size={15} className="text-[#f0cf8c]" />
                <span className="mt-4 block text-[9px] uppercase tracking-[.13em] text-muted">
                  Weight
                </span>
                <strong className="mt-1 block text-lg text-platinum">
                  {record.bestWeight} kg
                </strong>
              </div>

              <div className="rounded-2xl border border-gold/15 bg-black/15 p-3">
                <Repeat2 size={15} className="text-[#f0cf8c]" />
                <span className="mt-4 block text-[9px] uppercase tracking-[.13em] text-muted">
                  Best reps
                </span>
                <strong className="mt-1 block text-lg text-platinum">
                  {record.bestReps}
                </strong>
              </div>

              <div className="rounded-2xl border border-gold/15 bg-black/15 p-3">
                <CalendarDays size={15} className="text-[#f0cf8c]" />
                <span className="mt-4 block text-[9px] uppercase tracking-[.13em] text-muted">
                  Achieved
                </span>
                <strong className="mt-1 block text-sm text-platinum">
                  {formatDate(record.achievedAt, {
                    year: undefined,
                    month: "short",
                  })}
                </strong>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#f0cf8c]" />
                <strong className="text-sm text-platinum">Progress</strong>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="block text-[9px] uppercase tracking-[.12em] text-muted">
                    Previous
                  </span>
                  <strong className="mt-1 block text-sm text-silver">
                    {record.previous.weight
                      ? `${record.previous.weight} kg`
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span className="block text-[9px] uppercase tracking-[.12em] text-muted">
                    Current
                  </span>
                  <strong className="mt-1 block text-sm text-platinum">
                    {record.bestWeight} kg
                  </strong>
                </div>

                <div>
                  <span className="block text-[9px] uppercase tracking-[.12em] text-muted">
                    {record.progress.label}
                  </span>
                  <strong className="mt-1 block text-sm text-[#f0cf8c]">
                    {record.progress.value}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2 border-t border-gold/15 pt-4">
              {record.workoutSession?._id && (
                <Link
                  to={`/history/${record.workoutSession._id}`}
                  className="focus-ring inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.045] px-3 text-xs font-bold text-silver"
                >
                  Workout detail
                  <ArrowRight size={15} />
                </Link>
              )}

              <button
                type="button"
                onClick={() => setSelected(record)}
                className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-300"
                aria-label={`Delete ${record.exercise?.name || "record"}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}

        {!records.length && (
          <EmptyState
            icon={Medal}
            title="No personal records yet"
            copy="Finish a workout with weight and reps. LiftLog will create the first record automatically."
            action={
              <Link
                to="/plans"
                className="inline-flex min-h-11 items-center rounded-xl bg-platinum px-4 text-sm font-bold text-void"
              >
                Start from a workout plan
              </Link>
            }
          />
        )}
      </section>

      <ConfirmDialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onConfirm={remove}
        loading={deleting}
        title="Delete this personal record?"
        copy="The saved record will be removed. Workout history will not be deleted."
      />
    </div>
  );
}
