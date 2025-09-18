import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import LeadsList from "./pages/leads/LeadsList";
import LeadForm from "./pages/leads/LeadForm";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/leads" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <LeadsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads/create"
          element={
            <ProtectedRoute>
              <LeadForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads/:id/edit"
          element={
            <ProtectedRoute>
              <LeadForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
