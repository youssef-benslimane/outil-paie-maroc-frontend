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
import ParamCotisationPage from "./pages/ParamCotisationPage.jsx";
import ParamPrimePage from "./pages/ParamPrimePage.jsx";
import ParamAbsencePage from "./pages/ParamAbsencePage.jsx";
import ParamTempsPage from "./pages/ParamTempsPage.jsx";
import ParamMotifMesurePage from "./pages/ParamMotifMesurePage.jsx";
import ParamEtatPage from "./pages/ParamEtatPage.jsx";
import ParamBaremeIr from "./pages/ParamBaremeIr.jsx";
import ParamProfilGrillePage from "./pages/ParamProfilGrillePage.jsx";
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
        {/* Paramétrage des cotisations */}
        <Route
          path="/configurateur/param-cotisations"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamCotisationPage />
            </ProtectedRoute>
          }
        />
        {/* Paramétrage des absences */}
        <Route
          path="/configurateur/param-absence"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamAbsencePage />
            </ProtectedRoute>
          }
        />
        {/* Paramétrage des primes & indémnités */}
        <Route
          path="/configurateur/param-prime"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamPrimePage />
            </ProtectedRoute>
          }
        />
        {/* Paramétrage Barème IR */}
        <Route
          path="/configurateur/param-bareme-ir"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamBaremeIr />
            </ProtectedRoute>
          }
        />
        {/* Paramétrage Données des temps */}
        <Route
          path="/configurateur/param-temps"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamTempsPage />
            </ProtectedRoute>
          }
        />
        {/* Paramétrage Motifs & Mesures */}
        <Route
          path="/configurateur/param-motif-mesure"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamMotifMesurePage />
            </ProtectedRoute>
          }
        />
        {/* Paramétrage des états */}
        <Route
          path="/configurateur/param-etat"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamEtatPage />
            </ProtectedRoute>
          }
        />
        {/* Paramétrage Profils et Grilles */}
        <Route
          path="/configurateur/param-profil-grille"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamProfilGrillePage />
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
