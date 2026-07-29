import { useEffect, useState } from "react";
import { Plus, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { planApi } from "../../api/planApi";
import { getErrorMessage } from "../../api/http";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import PlanCard from "../../components/workouts/PlanCard";
import { useToast } from "../../context/ToastContext";

export default function WorkoutPlansPage() {
  const toast = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const { data } = await planApi.getAll();
      setPlans(data.workoutPlans || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      await planApi.remove(selected._id);
      setPlans((current) => current.filter((plan) => plan._id !== selected._id));
      toast.success(`${selected.name} was deleted.`);
      setSelected(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete plan."));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader label="Loading workout plans" />;

  return (
    <div>
      <PageHeader
        kicker="Your training structure"
        title="Workout Plans"
        copy="Create routines around your schedule, preferred exercises, sets, reps, and rest times."
        actions={
          <Link
            to="/plans/new"
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-platinum px-4 text-sm font-bold text-void transition hover:-translate-y-0.5"
          >
            <Plus size={17} />
            Create plan
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan._id} plan={plan} onDelete={setSelected} />
        ))}

        {!plans.length && (
          <EmptyState
            icon={CalendarDays}
            title="No workout plans yet"
            copy="Build your first routine by choosing training days and exercises from the shared library."
            action={
              <Link to="/plans/new">
                <Button><Plus size={17} />Create your first plan</Button>
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
        title={`Delete ${selected?.name || "plan"}?`}
        copy="The workout plan will be removed. Completed workout sessions remain in your history."
      />
    </div>
  );
}
