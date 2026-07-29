import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "../common/Logo";
import Avatar from "../common/Avatar";
import { adminNavigation, userNavigation } from "./navigation";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth();
  const navigation = isAdmin ? adminNavigation : userNavigation;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] border-r border-white/10 bg-carbon/90 p-4 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="px-2 py-3">
        <Logo to={isAdmin ? "/admin" : "/dashboard"} />
      </div>

      <div className="mt-7 rounded-2xl border border-white/10 bg-white/[.035] p-3">
        <div className="flex items-center gap-3">
          <Avatar user={user} size="sm" />
          <div className="min-w-0">
            <strong className="block truncate text-sm text-platinum">{user?.name}</strong>
            <span className="block truncate text-xs capitalize text-muted">
              {user?.role || "user"} account
            </span>
          </div>
        </div>
      </div>

      <nav className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-1">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.22em] text-muted">
          Navigation
        </p>
        <div className="grid gap-1.5">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={`${label}-${to}`}
              to={to}
              end={end}
              className={({ isActive }) =>
                `focus-ring flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition ${
                  isActive
                    ? "border border-white/15 bg-white/[.09] text-platinum shadow-lg shadow-black/20"
                    : "border border-transparent text-muted hover:bg-white/[.045] hover:text-silver"
                }`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <button
        type="button"
        onClick={logout}
        className="focus-ring mt-4 flex min-h-12 items-center gap-3 rounded-2xl border border-transparent px-3 text-sm font-semibold text-muted transition hover:border-red-500/15 hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut size={19} />
        Logout
      </button>

      <p className="mt-5 px-3 text-[10px] leading-5 text-muted/60">
        Train with intent. Track with precision.
      </p>
    </aside>
  );
}
