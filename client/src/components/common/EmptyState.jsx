import { Dumbbell } from "lucide-react";

export default function EmptyState({
  icon: Icon = Dumbbell,
  title,
  copy,
  action,
}) {
  return (
    <div className="glass-card col-span-full grid min-h-72 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[.055] text-silver">
          <Icon size={25} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold text-platinum">
          {title}
        </h2>
        {copy && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{copy}</p>}
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
