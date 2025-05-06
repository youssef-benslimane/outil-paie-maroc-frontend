import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { useAuth } from "../contexts/AuthContext.jsx";
import ConfigurateurSidebar from "../components/ConfigurateurSidebar.jsx";

export default function ConfigurateurHomePage() {
  const { user } = useAuth();

  return (
    <div className="d-flex">
      {/* Contenu principal */}
      {/* Espace principal centré */}
      <MDBContainer
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", marginLeft: "240px" }}
      >
        <h1>
          Bienvenue {user.prenom} {user.nom}
        </h1>
      </MDBContainer>

      {/* Sidebar à droite */}
      <ConfigurateurSidebar />
    </div>
  );
}
