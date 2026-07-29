import { motion } from "framer-motion";
import { Medal, Sparkles } from "lucide-react";

export default function PersonalRecordBanner({ records = [] }) {
  if (!records.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/20 via-gold/5 to-transparent p-6 shadow-[0_25px_80px_rgba(214,173,88,.13)] sm:p-8"
    >
      <Sparkles className="absolute right-6 top-6 text-gold/70" />
      <div className="relative z-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#f0cf8c]">
          <Medal size={14} />
          New personal record
        </span>
        <h2 className="mt-5 font-display text-3xl font-extrabold tracking-[-.05em] text-platinum sm:text-4xl">
          The standard just moved.
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {records.map((record) => (
            <div
              key={record._id}
              className="rounded-2xl border border-gold/20 bg-black/20 p-4"
            >
              <strong className="block text-platinum">
                {record.exercise?.name || "Exercise"}
              </strong>
              <span className="mt-1 block text-sm text-[#f0cf8c]">
                {record.bestWeight} kg × {record.bestReps}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
