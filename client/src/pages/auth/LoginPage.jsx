import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../../components/common/Logo";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../api/http";
import cbumImage from "../../assets/chris-bumstead.jpg";

export default function LoginPage() {
  const { user, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const currentUser = await login(form);
      toast.success("Welcome back. Your dashboard is ready.");
      const fallback = currentUser?.role === "admin" ? "/admin" : "/dashboard";
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to sign in."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-void lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <img src={cbumImage} alt="Chris Bumstead in a gym" className="absolute inset-0 h-full w-full object-cover object-top grayscale" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/45 to-void" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-black/15" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <Logo />
          <div className="max-w-xl">
            <p className="section-kicker">The work stays honest</p>
            <h1 className="mt-5 font-display text-6xl font-extrabold leading-[.94] tracking-[-.07em]">
              The log remembers what motivation forgets.
            </h1>
            <p className="mt-6 text-base leading-7 text-silver/70">
              Return to your plans, your numbers, and the next standard you are building toward.
            </p>
          </div>
          <p className="text-xs text-muted">Training inspiration image used under CC BY 3.0. No endorsement implied.</p>
        </div>
      </section>

      <section className="grid place-items-center px-4 py-10 sm:px-8 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 lg:hidden"><Logo /></div>
          <p className="section-kicker">Welcome back</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-.055em] sm:text-5xl">
            Sign in to LiftLog.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Open your dashboard and continue from the last recorded set.
          </p>

          <form onSubmit={submit} className="mt-8 grid gap-5">
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
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Enter your password"
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

            <Button type="submit" loading={loading} className="mt-1 min-h-12 w-full">
              Sign in
              {!loading && <ArrowRight size={17} />}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-muted">
            New to LiftLog?{" "}
            <Link to="/register" className="font-bold text-platinum hover:underline">
              Create your account
            </Link>
          </p>
        </motion.div>
      </section>
    </div>
  );
}
