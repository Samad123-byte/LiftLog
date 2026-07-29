import { Check, Minus, Plus } from "lucide-react";

export default function SetRow({
  set,
  index,
  onChange,
  onRemove,
  canRemove,
}) {
  return (
    <div
      className={`grid grid-cols-[42px_1fr_1fr_44px] items-end gap-2 rounded-2xl border p-2.5 transition sm:grid-cols-[52px_1fr_1fr_48px] sm:p-3 ${
        set.completed
          ? "border-emerald-400/20 bg-emerald-400/[.055]"
          : "border-white/10 bg-white/[.03]"
      }`}
    >
      <span className="grid h-11 place-items-center rounded-xl border border-white/10 bg-white/[.045] text-xs font-bold text-muted">
        {index + 1}
      </span>

      <label>
        <span className="label !mb-1 !text-[9px]">Weight kg</span>
        <input
          className="field !h-11 !px-3"
          type="number"
          min="0"
          step="0.5"
          value={set.weight}
          onChange={(event) => onChange({ ...set, weight: event.target.value })}
          inputMode="decimal"
        />
      </label>

      <label>
        <span className="label !mb-1 !text-[9px]">Reps</span>
        <input
          className="field !h-11 !px-3"
          type="number"
          min="1"
          value={set.reps}
          onChange={(event) => onChange({ ...set, reps: event.target.value })}
          inputMode="numeric"
        />
      </label>

      <button
        type="button"
        onClick={() => onChange({ ...set, completed: !set.completed })}
        className={`focus-ring grid h-11 w-11 place-items-center rounded-xl border transition ${
          set.completed
            ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-300"
            : "border-white/10 bg-white/[.045] text-muted hover:text-platinum"
        }`}
        aria-label={set.completed ? "Mark set incomplete" : "Complete set"}
      >
        <Check size={18} />
      </button>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="col-start-4 grid h-8 w-11 place-items-center rounded-lg text-red-300/70 transition hover:bg-red-500/10 hover:text-red-300"
          aria-label="Remove set"
        >
          <Minus size={15} />
        </button>
      )}
    </div>
  );
}

export function AddSetButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-dashed border-white/15 px-3 text-xs font-semibold text-muted transition hover:border-white/25 hover:bg-white/[.04] hover:text-platinum"
    >
      <Plus size={15} />
      Add set
    </button>
  );
}
