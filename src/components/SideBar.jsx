// src/components/SideBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MDBListGroup, MDBListGroupItem, MDBIcon } from "mdb-react-ui-kit";

export default function SideBar() {
  const { pathname } = useLocation();
  const items = [
    { to: "/profil", icon: "user", label: "Mon profil" },
    { to: "/demande-document", icon: "file-alt", label: "Demande docs" },
    { to: "/demande-conges", icon: "calendar-alt", label: "Demande congés" },
    { to: "/fiches-paie", icon: "file-invoice", label: "Mes fiches" },
    { to: "/mot-de-passe-oublie", icon: "key", label: "Modifier MD-P" },
  ];

  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        backgroundColor: "#2c3e50",
        color: "#fff",
        paddingTop: "1rem",
        position: "fixed",
        top: 0,
        left: 0,
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
