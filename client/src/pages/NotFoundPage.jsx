import { ArrowLeft, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-void p-4">
      <div className="max-w-2xl text-center">
        <div className="mb-10 inline-flex"><Logo /></div>
        <span className="chrome-text font-display text-[clamp(7rem,22vw,14rem)] font-extrabold leading-[.7] tracking-[-.09em]">
          404
        </span>
        <Dumbbell className="mx-auto mt-10 text-muted" size={38} />
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-[-.055em] sm:text-6xl">
          This route missed the rack.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
          The page does not exist, but your next workout still does.
        </p>
        <Link
          to="/"
          className="focus-ring mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-platinum px-5 text-sm font-bold text-void"
        >
          <ArrowLeft size={17} />
          Return home
        </Link>
      </div>
    </div>
  );
}
