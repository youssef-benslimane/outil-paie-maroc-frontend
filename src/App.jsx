// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RhDashboard from "./pages/RhDashboard.jsx";
import EmployeDashboard from "./pages/EmployeDashboard.jsx";
import ConfigurateurHomePage from "./pages/ConfigurateurHomePage.jsx";
import ParamAdminPage from "./pages/ParamAdminPage.jsx";
import MonProfilPage from "./pages/MonProfilPage.jsx";
import CreateEntityPage from "./pages/CreateEntityPage";
import EditEntityPage from "./pages/EditEntityPage";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* / ou index → /login */}
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />

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

        <Route path="/profil" element={<MonProfilPage />} />
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
              <ConfigurateurHomePage />
            </ProtectedRoute>
          }
        />

        {/* Paramétrage des données administratives */}
        <Route
          path="/configurateur/param-admin"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurateur/param-admin/:entity/create"
          element={<CreateEntityPage />}
        />

        <Route
          path="/configurateur/param-admin/edit/:entity/:id"
          element={<EditEntityPage />}
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
