import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../../components/common/Logo";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../api/http";

export default function RegisterPage() {
  const { user, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const currentUser = await register(form);
      toast.success("Account created. Your first plan is waiting.");
      navigate(currentUser?.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create your account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-void px-4 py-8 sm:px-6">
      <div className="absolute left-[-10rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-white/[.055] blur-3xl" />
      <div className="absolute bottom-[-15rem] right-[-8rem] h-[36rem] w-[36rem] rounded-full border border-white/[.06]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Logo />
        <div className="grid min-h-[calc(100vh-90px)] items-center gap-10 py-10 lg:grid-cols-[.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="section-kicker">Create your training account</p>
            <h1 className="mt-5 max-w-xl font-display text-5xl font-extrabold leading-[.95] tracking-[-.065em] sm:text-7xl">
              Build proof, not promises.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted">
              Your account keeps workout plans, completed sessions, profile data, and personal records in one focused system.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                ["01", "Create routines"],
                ["02", "Log workouts"],
                ["03", "Track records"],
              ].map(([number, label]) => (
                <div key={number} className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                  <span className="text-xs font-bold text-muted">{number}</span>
                  <strong className="mt-5 block text-sm text-platinum">{label}</strong>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            className="chrome-border rounded-[2rem] bg-carbon/85 p-5 shadow-chrome backdrop-blur-2xl sm:p-8"
          >
            <p className="section-kicker">User registration</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-.05em] sm:text-4xl">
              Start your LiftLog.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Admin accounts are managed separately. New registrations become user accounts.
            </p>

            <form onSubmit={submit} className="mt-7 grid gap-5">
              <label>
                <span className="label">Full name</span>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input
                    className="field pl-11"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Abdul Rahman"
                  />
                </div>
              </label>

              <label>
                <span className="label">Email address</span>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input
                    className="field pl-11"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label>
                <span className="label">Password</span>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input
                    className="field px-11"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition hover:text-platinum"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <Button type="submit" loading={loading} className="min-h-12 w-full">
                Create account
                {!loading && <ArrowRight size={17} />}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Already registered?{" "}
              <Link to="/login" className="font-bold text-platinum hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
