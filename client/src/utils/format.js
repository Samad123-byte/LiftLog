export function formatDate(value, options = {}) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(value));
}

export function formatDuration(minutes = 0) {
  const total = Number(minutes) || 0;
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatVolume(volume = 0) {
  return `${new Intl.NumberFormat("en-US").format(Math.round(volume))} kg`;
}

export function getInitials(name = "LiftLog User") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function monthYear(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
