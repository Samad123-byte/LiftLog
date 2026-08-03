import { Download } from "lucide-react";
import { useInstall } from "../../context/InstallContext";

export default function InstallButton({ className = "" }) {
  const { canInstall, installed, install } = useInstall();

  if (installed || !canInstall) return null;

  return (
    <button
      onClick={install}
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-platinum px-4 text-sm font-bold text-void transition hover:-translate-y-0.5 hover:bg-white ${className}`}
    >
      <Download size={18} />
      Install LiftLog
    </button>
  );
}