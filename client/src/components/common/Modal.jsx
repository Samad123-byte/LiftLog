import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const widths = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-black/75 p-3 backdrop-blur-md sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            className={`chrome-border relative w-full ${widths[size]} rounded-3xl bg-carbon p-5 shadow-chrome sm:p-6`}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-bold text-platinum">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[.045] text-muted transition hover:text-platinum"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
