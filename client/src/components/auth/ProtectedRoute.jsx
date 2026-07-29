import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Restoring your training session" />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RoleRoute({ role }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking access" />;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <Outlet />;
}
