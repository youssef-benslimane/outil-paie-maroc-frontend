// src/pages/ConfigurateurHomePage.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import ConfigurateurSidebar from "../components/ConfigurateurSidebar.jsx";
import { Box, Typography } from "@mui/material";

const drawerWidth = 240;

export default function ConfigurateurHomePage() {
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      {/* votre sidebar (fixe à 240px) */}
      <ConfigurateurSidebar />

      {/* contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // décale et redimensionne le main en fonction de la sidebar
          ml: { xs: 0, sm: `${drawerWidth}px` },
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          p: 3,
        }}
      >
        <Typography variant="h4" align="center">
          Bienvenue {user.prenom} {user.nom}
        </Typography>
      </Box>
    </Box>
  );
}
