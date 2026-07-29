import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

function SkeletonBlock({ className = "" }) {
  return <span className={`skeleton block rounded-2xl ${className}`} />;
}

export default function Loader({ label = "Loading" }) {
  return (
    <div className="min-h-[65vh]" aria-live="polite" aria-busy="true">
      <div className="mb-7 flex items-center gap-4">
        <motion.span
          animate={{ rotate: [0, -8, 8, 0], y: [0, -3, 0] }}
          transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[.055] text-silver shadow-panel"
        >
          <Dumbbell size={23} />
        </motion.span>
        <div>
          <strong className="block text-sm text-platinum">{label}</strong>
          <span className="mt-1 block text-xs text-muted">Preparing your LiftLog data…</span>
        </div>
      </div>

      <div className="grid gap-5">
        <section className="glass-card p-6 sm:p-8">
          <SkeletonBlock className="h-3 w-32" />
          <SkeletonBlock className="mt-5 h-11 w-[min(520px,82%)]" />
          <SkeletonBlock className="mt-4 h-4 w-[min(660px,94%)]" />
          <SkeletonBlock className="mt-2 h-4 w-[min(500px,76%)]" />
          <div className="mt-8 flex gap-3">
            <SkeletonBlock className="h-11 w-36" />
            <SkeletonBlock className="h-11 w-28" />
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="glass-card p-5">
              <SkeletonBlock className="h-11 w-11" />
              <SkeletonBlock className="mt-8 h-8 w-24" />
              <SkeletonBlock className="mt-3 h-3 w-32" />
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="glass-card overflow-hidden">
              <SkeletonBlock className="aspect-[4/3] w-full !rounded-none" />
              <div className="p-5">
                <SkeletonBlock className="h-5 w-2/3" />
                <SkeletonBlock className="mt-3 h-3 w-1/2" />
                <SkeletonBlock className="mt-6 h-10 w-full" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
