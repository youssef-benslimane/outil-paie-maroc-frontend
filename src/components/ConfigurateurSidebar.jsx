import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MDBListGroup, MDBListGroupItem, MDBIcon } from "mdb-react-ui-kit";

export default function ConfigurateurSidebar() {
  const { pathname } = useLocation();
  const items = [
    { to: "/configurateur", icon: "home", label: "Accueil" },
    {
      to: "/configurateur/param-admin",
      icon: "building",
      label: "Paramétrage des données administratives",
    },
    {
      to: "/configurateur/param-etats",
      icon: "chart-bar",
      label: " Paramétrage des états",
    },
    {
      to: "/configurateur/param-cotisations",
      icon: "circle-dollar-to-slot",
      label: "Paramétrage des cotisations",
    },
    {
      to: "/configurateur/param-absence",
      icon: "umbrella-beach",
      label: "Paramétrage des absences",
    },
    {
      to: "/configurateur/param-primes",
      icon: "award",
      label: "Paramétrage des primes et indémnité",
    },
    {
      to: "/configurateur/param-bareme-ir",
      icon: "percent",
      label: "Paramétrage barème IR",
    },
    {
      to: "/configurateur/param-temps",
      icon: "clock",
      label: "Paramétrage des données temps",
    },
    {
      to: "/configurateur/param-mesures",
      icon: "tasks",
      label: "Paramétrage des mesures et motifs",
    },
    {
      to: "/configurateur/param-profils",
      icon: "layer-group",
      label: "Paramétrage des profils et grilles salariales",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "240px",
        height: "100vh",
        backgroundColor: "#2c3e50",
        color: "#fff",
        paddingTop: "1rem",
        overflowY: "auto", // ← active le scroll vertical
        paddingBottom: "1rem",
      }}
    >
      <MDBListGroup flush>
        {items.map(({ to, icon, label }) => (
          <Link to={to} key={to} style={{ textDecoration: "none" }}>
            <MDBListGroupItem
              style={{
                backgroundColor: pathname === to ? "#1a252f" : "transparent",
                color: "#fff",
                border: "none",
                padding: "1rem 1.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MDBIcon fas icon={icon} className="me-3" />
              <span>{label}</span>
            </MDBListGroupItem>
          </Link>
        ))}
      </MDBListGroup>
    </div>
  );
}
