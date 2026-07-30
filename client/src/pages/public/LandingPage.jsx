import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  Dumbbell,
  History,
  Medal,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import Logo from "../../components/common/Logo";
import cbumImage from "../../assets/chris-bumstead.jpg";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";

const features = [
  {
    icon: Dumbbell,
    title: "Build plans that fit you",
    copy: "Choose training days, exercises, sets, reps, and rest times. Your routine stays yours.",
  },
  {
    icon: BarChart3,
    title: "Track every working set",
    copy: "Log weight and reps while you train, then save volume, duration, and session notes.",
  },
  {
    icon: Medal,
    title: "See personal records",
    copy: "LiftLog checks each completed workout and highlights the moments you move the standard.",
  },
  {
    icon: History,
    title: "Keep a complete history",
    copy: "Review past sessions, individual exercise performance, volume, sets, and total reps.",
  },
];

export default function LandingPage() {



  const { user, loading } = useAuth();

  if (loading) {
  return <Loader label="Loading LiftLog..." />;
}
  if (user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-void text-platinum">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.06] bg-void/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm font-semibold text-muted transition hover:text-platinum">
              Features
            </a>
            <a href="#roles" className="text-sm font-semibold text-muted transition hover:text-platinum">
              Roles
            </a>
            <a href="#mindset" className="text-sm font-semibold text-muted transition hover:text-platinum">
              Mindset
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="focus-ring hidden min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold text-silver transition hover:bg-white/[.055] hover:text-platinum sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-platinum px-4 text-sm font-bold text-void transition hover:-translate-y-0.5 hover:bg-white"
            >
              Start logging
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[880px] overflow-hidden pt-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,.11),transparent_28rem)]" />
          <div className="absolute inset-y-0 right-0 w-full lg:w-[52%]">
            <img
              src={cbumImage}
              alt="Chris Bumstead in a gym"
              className="h-full w-full object-cover object-center grayscale"
            />
            <div className="hero-noise absolute inset-0" />
          </div>

          <div className="relative z-10 mx-auto grid min-h-[800px] max-w-[1500px] items-center px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.045] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-silver backdrop-blur-xl">
                <Sparkles size={14} />
                Train with intent
              </div>

              <h1 className="mt-7 font-display text-[clamp(4rem,9vw,9rem)] font-extrabold leading-[.84] tracking-[-.085em]">
                Every set.
                <br />
                Every rep.
                <br />
                <span className="chrome-text">Every record.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-silver/75 sm:text-lg">
                LiftLog turns your training into a clear system. Build your own plans,
                log live workouts, review history, and watch personal records move.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="focus-ring inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-platinum px-6 text-sm font-extrabold text-void transition hover:-translate-y-1 hover:bg-white"
                >
                  <Play size={18} fill="currentColor" />
                  Create free account
                </Link>
                <Link
                  to="/login"
                  className="focus-ring inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[.055] px-6 text-sm font-extrabold text-platinum backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[.09]"
                >
                  Open your dashboard
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="mt-11 flex flex-wrap gap-x-7 gap-y-3 text-xs text-muted">
                {["User-built plans", "Live set tracking", "Automatic PR checks"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <Check size={15} className="text-silver" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="mt-12 self-end lg:mt-0 lg:justify-self-end"
            >
              <div className="chrome-border max-w-sm rounded-3xl bg-black/45 p-5 shadow-chrome backdrop-blur-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-muted">
                  Training inspiration
                </p>
                <strong className="mt-3 block font-display text-2xl font-extrabold tracking-[-.04em] text-platinum">
                  Standards over moods.
                </strong>
                <p className="mt-3 text-sm leading-6 text-silver/65">
                  Show up, control the work, and give progress enough time to become visible.
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs text-muted">Inspired by classic physique discipline</span>
                  <ShieldCheck size={18} className="text-silver" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="px-4 py-24 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1500px]">
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-kicker">The complete training loop</p>
              <h2 className="mt-4 font-display text-4xl font-extrabold tracking-[-.055em] sm:text-6xl">
                Less guessing. More evidence.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted">
                Every screen is designed to keep the workout moving while still collecting the data that matters.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {features.map(({ icon: Icon, title, copy }, index) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="glass-card chrome-border min-h-72 p-6"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[.055] text-silver">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-16 font-display text-2xl font-bold tracking-[-.04em]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="roles" className="border-y border-white/[.06] bg-white/[.02] px-4 py-24 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-[1500px] gap-5 lg:grid-cols-2">
            <article className="chrome-border rounded-[2rem] bg-gradient-to-br from-white/[.08] to-transparent p-7 sm:p-10">
              <p className="section-kicker">For athletes</p>
              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-[-.055em] sm:text-5xl">
                Own the process.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-muted">
                Users create their own routines, start sessions, record working sets, review history, and manage fitness profiles.
              </p>
              <ul className="mt-8 grid gap-3 text-sm text-silver">
                {["Workout plan builder", "Live session logging", "History and workout details", "Personal-record dashboard"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[.07]"><Check size={14} /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="chrome-border rounded-[2rem] bg-dark-metal p-7 sm:p-10">
              <p className="section-kicker">For administrators</p>
              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-[-.055em] sm:text-5xl">
                Protect the library.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-muted">
                Admins maintain the shared exercise catalogue without controlling personal workout plans.
              </p>
              <ul className="mt-8 grid gap-3 text-sm text-silver">
                {["Create exercises", "Upload exercise images", "Edit exercise details", "Delete and review catalogue entries"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[.07]"><Check size={14} /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="mindset" className="px-4 py-24 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] border border-white/10 bg-platinum text-void">
            <div className="grid lg:grid-cols-[.9fr_1.1fr]">
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-void/55">
                  Built for long-term progress
                </p>
                <h2 className="mt-5 font-display text-5xl font-extrabold leading-[.95] tracking-[-.065em] sm:text-7xl">
                  Your strongest version leaves a trail.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-void/65">
                  LiftLog makes that trail visible—from the first plan to the next personal best.
                </p>
                <Link
                  to="/register"
                  className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-void px-5 text-sm font-bold text-platinum transition hover:-translate-y-1"
                >
                  Begin your log
                  <ArrowRight size={17} />
                </Link>
              </div>
              <div className="relative min-h-[420px] overflow-hidden">
                <img
                  src={cbumImage}
                  alt="Chris Bumstead in a gym"
                  className="absolute inset-0 h-full w-full object-cover object-top grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-platinum via-platinum/20 to-transparent lg:bg-gradient-to-r" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[.06] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} LiftLog. Train. Track. Progress.</span>
          <span>
            Chris Bumstead photo: Gymshark, CC BY 3.0 via Wikimedia Commons. No endorsement implied.
          </span>
        </div>
      </footer>
    </div>
  );
}
