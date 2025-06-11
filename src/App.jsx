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
import ParamBulletinPaiePage from "./pages/ParamBulletinPaiePage.jsx";
import ParamJournalPaiePage from "./pages/ParamJournalPaiePage.jsx";
import ParamAttestationSalairePage from "./pages/ParamAttestationSalairePage.jsx";
import ParamAttestationTravailPage from "./pages/ParamAttestationTravailPage.jsx";
import ParamBaremeIr from "./pages/ParamBaremeIr.jsx";
import ParamProfilGrillePage from "./pages/ParamProfilGrillePage.jsx";
import MonProfilPage from "./pages/MonProfilPage.jsx";
import CreateEntityPage from "./pages/CreateEntityPage";
import EditEntityPage from "./pages/EditEntityPage";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdministrateurHomePage from "./pages/AdministrateurHomePage.jsx";
import GestionUtilisateursPage from "./pages/GestionUtilisateursPage.jsx";
import RechercheSalariePage from "./pages/RechercheSalariePage.jsx";
import ElementsVariablesPaiePage from "./pages/ElementsVariablesPaiePage.jsx";
import CalculPaiePage from "./pages/CalculPaiePage.jsx";
import EnvoiBulletinsPage from "./pages/EnvoiBulletinsPage.jsx";
import GestionAdminSalariesPage from "./pages/GestionAdminSalariesPage.jsx";
import RhHomePage from "./pages/RhHomePage.jsx";

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
              <AdministrateurHomePage />
            </ProtectedRoute>
          }
        />

        {/* Gestions des utilisateurs */}
        <Route
          path="/admin/gestion-users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <GestionUtilisateursPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rh"
          element={
            <ProtectedRoute allowedRoles={["RH"]}>
              <RhHomePage />
            </ProtectedRoute>
          }
        />

        {/* Recherche d'un salarié */}
        <Route
          path="/rh/recherche-salarie"
          element={
            <ProtectedRoute allowedRoles={["RH"]}>
              <RechercheSalariePage />
            </ProtectedRoute>
          }
        />

        {/* Eléments variables de paie */}
        <Route
          path="/rh/elements-variables"
          element={
            <ProtectedRoute allowedRoles={["RH"]}>
              <ElementsVariablesPaiePage />
            </ProtectedRoute>
          }
        />

        {/* Calcul de paie */}
        <Route
          path="/rh/calcul-paie"
          element={
            <ProtectedRoute allowedRoles={["RH"]}>
              <CalculPaiePage />
            </ProtectedRoute>
          }
        />

        {/* Envoi des bulletins */}
        <Route
          path="/rh/envoi-bulletins"
          element={
            <ProtectedRoute allowedRoles={["RH"]}>
              <EnvoiBulletinsPage />
            </ProtectedRoute>
          }
        />

        {/* Gestion administrative des salariés */}
        <Route
          path="/rh/gestion-admin-salaries"
          element={
            <ProtectedRoute allowedRoles={["RH"]}>
              <GestionAdminSalariesPage />
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
        {/* Paramétrage Bulletin de paie */}
        <Route
          path="/configurateur/param-bulletin-paie"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamBulletinPaiePage />
            </ProtectedRoute>
          }
        />
        {/* Paramétrage Journal de paie */}
        <Route
          path="/configurateur/param-journal-paie"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamJournalPaiePage />
            </ProtectedRoute>
          }
        />
        {/* Paramétrage Attestation Salaire */}
        <Route
          path="/configurateur/param-attestation-salaire"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamAttestationSalairePage />
            </ProtectedRoute>
          }
        />
        {/* Paramétrage Attestation Travail */}
        <Route
          path="/configurateur/param-attestation-travail"
          element={
            <ProtectedRoute allowedRoles={["CONFIGURATEUR"]}>
              <ParamAttestationTravailPage />
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
