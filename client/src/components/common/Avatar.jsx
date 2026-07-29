import { getInitials } from "../../utils/format";

export default function Avatar({ user, size = "md", className = "" }) {
  const sizes = {
    sm: "h-9 w-9 rounded-xl text-xs",
    md: "h-11 w-11 rounded-2xl text-sm",
    lg: "h-24 w-24 rounded-3xl text-xl",
  };

  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.name || "Profile"}
        className={`${sizes[size]} object-cover ring-1 ring-white/15 ${className}`}
      />
    );
  }

  return (
    <span
      className={`${sizes[size]} grid place-items-center bg-chrome font-display font-extrabold text-void ring-1 ring-white/15 ${className}`}
      aria-label={user?.name || "Profile"}
    >
      {getInitials(user?.name)}
    </span>
  );
}
