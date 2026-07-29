import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import { ProtectedRoute, RoleRoute } from "./components/auth/ProtectedRoute";

import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

import DashboardPage from "./pages/user/DashboardPage";
import ExerciseLibraryPage from "./pages/user/ExerciseLibraryPage";
import ExerciseDetailPage from "./pages/user/ExerciseDetailPage";
import WorkoutPlansPage from "./pages/user/WorkoutPlansPage";
import PlanFormPage from "./pages/user/PlanFormPage";
import StartWorkoutPage from "./pages/user/StartWorkoutPage";
import WorkoutSummaryPage from "./pages/user/WorkoutSummaryPage";
import HistoryPage from "./pages/user/HistoryPage";
import WorkoutDetailPage from "./pages/user/WorkoutDetailPage";
import RecordsPage from "./pages/user/RecordsPage";
import ProfilePage from "./pages/user/ProfilePage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminExercisesPage from "./pages/admin/AdminExercisesPage";
import ExerciseFormPage from "./pages/admin/ExerciseFormPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/exercises" element={<ExerciseLibraryPage />} />
          <Route path="/exercises/:id" element={<ExerciseDetailPage />} />

          <Route element={<RoleRoute role="user" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/plans" element={<WorkoutPlansPage />} />
            <Route path="/plans/new" element={<PlanFormPage />} />
            <Route path="/plans/:id/edit" element={<PlanFormPage />} />
            <Route path="/workout/:planId" element={<StartWorkoutPage />} />
            <Route path="/workout-summary" element={<WorkoutSummaryPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:id" element={<WorkoutDetailPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<RoleRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/exercises" element={<AdminExercisesPage />} />
            <Route path="/admin/exercises/new" element={<ExerciseFormPage />} />
            <Route path="/admin/exercises/:id/edit" element={<ExerciseFormPage />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
