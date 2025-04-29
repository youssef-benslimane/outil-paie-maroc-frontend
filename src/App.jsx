// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RhDashboard from "./pages/RhDashboard.jsx";
import EmployeDashboard from "./pages/EmployeDashboard.jsx";
import ConfigurateurDashboard from "./pages/ConfigurateurDashboard.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* / ou index → /login */}
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rh"
          element={
            <ProtectedRoute allowedRoles={["RH"]}>
              <RhDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employe"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYE"]}>
              <EmployeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurateur"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ConfigurateurDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
