import {
  Activity,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  History,
  LayoutDashboard,
  Medal,
  PlusCircle,
  UserRound,
} from "lucide-react";

export const userNavigation = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Workout Plans", to: "/plans", icon: CalendarDays },
  { label: "Start Workout", to: "/plans", icon: Activity },
  { label: "History", to: "/history", icon: History },
  { label: "Personal Records", to: "/records", icon: Medal },
  { label: "Exercise Library", to: "/exercises", icon: Dumbbell },
  { label: "Profile", to: "/profile", icon: UserRound },
];

export const adminNavigation = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Exercises", to: "/admin/exercises", icon: ClipboardList },
  { label: "Create Exercise", to: "/admin/exercises/new", icon: PlusCircle },
  { label: "Library Preview", to: "/exercises", icon: BookOpen },
  { label: "Profile", to: "/admin/profile", icon: UserRound },
];
