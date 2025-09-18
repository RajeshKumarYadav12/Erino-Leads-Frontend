import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container p-8">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
