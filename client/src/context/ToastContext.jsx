import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info") => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => remove(id), 4200);
    },
    [remove],
  );

  const value = useMemo(
    () => ({
      push,
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
      info: (message) => push(message, "info"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-3 top-3 z-[100] grid w-[min(390px,calc(100vw-24px))] gap-2 sm:right-5 sm:top-5">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = icons[toast.type] || Info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 30, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.97 }}
                className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/10 bg-carbon/95 p-4 shadow-chrome backdrop-blur-xl"
              >
                <Icon
                  className={
                    toast.type === "success"
                      ? "mt-0.5 text-emerald-400"
                      : toast.type === "error"
                        ? "mt-0.5 text-red-400"
                        : "mt-0.5 text-silver"
                  }
                  size={19}
                />
                <p className="min-w-0 flex-1 text-sm leading-6 text-platinum">
                  {toast.message}
                </p>
                <button
                  type="button"
                  onClick={() => remove(toast.id)}
                  className="text-muted transition hover:text-platinum"
                  aria-label="Dismiss notification"
                >
                  <X size={17} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
