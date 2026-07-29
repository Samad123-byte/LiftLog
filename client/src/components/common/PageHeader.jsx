import { motion } from "framer-motion";

export default function PageHeader({ kicker, title, copy, actions }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-7 flex flex-col gap-5 sm:mb-9 lg:flex-row lg:items-end lg:justify-between"
    >
      <div>
        {kicker && <p className="section-kicker">{kicker}</p>}
        <h1 className="page-title mt-2">{title}</h1>
        {copy && <p className="page-copy">{copy}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </motion.header>
  );
}
