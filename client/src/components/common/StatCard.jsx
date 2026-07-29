import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="glass-card chrome-border p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[.055] text-silver">
          <Icon size={20} />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[.2em] text-muted">
          Live
        </span>
      </div>
      <strong className="mt-8 block font-display text-3xl font-extrabold tracking-[-.04em] text-platinum">
        {value}
      </strong>
      <span className="mt-1 block text-sm font-semibold text-silver">{label}</span>
      {helper && <p className="mt-2 text-xs leading-5 text-muted">{helper}</p>}
    </motion.article>
  );
}
