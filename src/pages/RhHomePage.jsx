// src/pages/RhHomePage.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import RhSidebar from "../components/RhSidebar.jsx";
import { Box, Typography } from "@mui/material";

const drawerWidth = 240;

export default function RhHomePage() {
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      {/* votre sidebar (fixe à 240px) */}
      <RhSidebar />

      {/* contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
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
