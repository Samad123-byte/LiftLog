import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "../common/Logo";
import Avatar from "../common/Avatar";
import { adminNavigation, userNavigation } from "./navigation";
import { useAuth } from "../../context/AuthContext";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigation = isAdmin ? adminNavigation : userNavigation;
  const quickItems = isAdmin
    ? navigation.slice(0, 3)
    : [
        userNavigation[0],
        userNavigation[1],
        userNavigation[3],
        userNavigation[4],
      ];

  const close = () => setOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-void/85 px-4 backdrop-blur-2xl lg:hidden">
        <Logo to={isAdmin ? "/admin" : "/dashboard"} />
        <div className="flex items-center gap-2">
          <Avatar user={user} size="sm" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[.045] text-silver"
            aria-label="Open navigation"
          >
            <Menu size={19} />
          </button>
        </div>
      </header>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-2xl border border-white/10 bg-carbon/90 p-1.5 shadow-chrome backdrop-blur-2xl lg:hidden">
        {quickItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={`${label}-${to}`}
            to={to}
            end={end}
            className={({ isActive }) =>
              `focus-ring flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[9px] font-semibold transition ${
                isActive ? "bg-white/[.1] text-platinum" : "text-muted"
              }`
            }
          >
            <Icon size={18} />
            <span className="max-w-full truncate">{label.replace("Workout ", "")}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="focus-ring flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-semibold text-muted"
        >
          <Menu size={18} />
          More
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => event.target === event.currentTarget && close()}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="custom-scrollbar ml-auto flex h-full w-[min(360px,calc(100vw-18px))] flex-col overflow-y-auto border-l border-white/10 bg-carbon p-4 shadow-chrome"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Logo to={isAdmin ? "/admin" : "/dashboard"} />
                <button
                  type="button"
                  onClick={close}
                  className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[.045] text-muted"
                  aria-label="Close navigation"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-3">
                <Avatar user={user} />
                <div className="min-w-0">
                  <strong className="block truncate text-sm text-platinum">{user?.name}</strong>
                  <span className="block truncate text-xs capitalize text-muted">
                    {user?.role}
                  </span>
                </div>
              </div>

              <nav className="mt-5 grid gap-1.5">
                {navigation.map(({ label, to, icon: Icon, end }) => (
                  <NavLink
                    key={`${label}-${to}`}
                    to={to}
                    end={end}
                    onClick={close}
                    className={({ isActive }) =>
                      `focus-ring flex min-h-12 items-center gap-3 rounded-2xl border px-3 text-sm font-semibold transition ${
                        isActive
                          ? "border-white/15 bg-white/[.09] text-platinum"
                          : "border-transparent text-muted hover:bg-white/[.045] hover:text-silver"
                      }`
                    }
                  >
                    <Icon size={19} />
                    {label}
                  </NavLink>
                ))}
              </nav>

              <button
                type="button"
                onClick={async () => {
                  close();
                  await logout();
                }}
                className="focus-ring mt-auto flex min-h-12 items-center gap-3 rounded-2xl border border-red-500/15 bg-red-500/10 px-3 text-sm font-semibold text-red-300"
              >
                <LogOut size={19} />
                Logout
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
