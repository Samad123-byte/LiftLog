import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

export default function Logo({ to = "/", compact = false }) {
  return (
    <Link to={to} className="focus-ring inline-flex items-center gap-3 rounded-xl">
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-white/20 bg-chrome text-void shadow-lg shadow-white/10">
        <Activity size={20} strokeWidth={2.4} />
        <i className="absolute inset-y-[-40%] left-[-45%] w-4 rotate-[18deg] bg-white/50 blur-sm animate-shimmer" />
      </span>
      {!compact && (
        <span className="font-display text-xl font-extrabold tracking-[-.045em] text-platinum">
          Lift<span className="text-silver">Log</span>
        </span>
      )}
    </Link>
  );
}
