import { LoaderCircle } from "lucide-react";

const variants = {
  primary:
    "border-white/10 bg-platinum text-void hover:bg-white hover:shadow-[0_14px_36px_rgba(255,255,255,.13)]",
  secondary:
    "border-white/10 bg-white/[.055] text-platinum hover:border-white/20 hover:bg-white/[.09]",
  ghost:
    "border-transparent bg-transparent text-silver hover:bg-white/[.06] hover:text-platinum",
  danger:
    "border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20",
  gold:
    "border-gold/30 bg-gold/15 text-[#f0cf8c] hover:bg-gold/25",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <LoaderCircle size={17} className="animate-spin" />}
      {children}
    </button>
  );
}
