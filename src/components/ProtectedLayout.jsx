import { ProtectedRoute } from "./ProtectedRoutes";
import { Outlet } from "react-router-dom";

export function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
