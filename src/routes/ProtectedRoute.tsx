import { Navigate, Outlet } from "react-router-dom";
import { storageKeys } from "../config/env";

interface ProtectedRouteProps {
  allowedRoles?: ("ADMIN" | "USER")[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem(storageKeys.token);
  const userRole = localStorage.getItem(storageKeys.role) as
    | "ADMIN"
    | "USER"
    | null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
