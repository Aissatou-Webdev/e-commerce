import React from "react";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // Si pas de token, redirige vers la page de login admin
    return <Navigate to="/login-admin" replace />;
  }

  // Sinon affiche le composant demandé
  return children;
};

export default AdminRoute;
