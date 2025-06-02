// src/pages/ParamEtatPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Toolbar,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ConfigurateurSidebar from "../components/ConfigurateurSidebar.jsx";

export default function ParamEtatPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // Define each tile’s label and navigation path:
  const tiles = [
    { key: "bulletin", label: "Bulletin de paie", path: "/bulletin-paie" },
    { key: "journal", label: "Journal de paie", path: "/journal-paie" },
    {
      key: "attestationTravail",
      label: "Attestation de travail",
      path: "/attestation-travail",
    },
    {
      key: "attestationSalaire",
      label: "Attestation de salaire",
      path: "/attestation-salaire",
    },
  ];

  // Split into two rows of two each:
  const topRow = tiles.slice(0, 2);
  const bottomRow = tiles.slice(2, 4);

  return (
    <Box sx={{ display: "flex" }}>
      <ConfigurateurSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 240px)` },
          ml: { md: "240px" },
        }}
      >
        <Toolbar />

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Paramétrage des états
          </Typography>

          {/* Top row: first two tiles */}
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={4} justifyContent="center">
              {topRow.map((tile) => (
                <Grid
                  item
                  key={tile.key}
                  xs={12}
                  sm={6}
                  md={6}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Paper
                    onClick={() => navigate(tile.path)}
                    elevation={3}
                    sx={{
                      width: isMdUp ? 300 : "100%",
                      height: isMdUp ? 180 : 140,
                      border: "2px solid",
                      borderColor: "grey.400",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Typography variant="h6">{tile.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Bottom row: next two tiles */}
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={4} justifyContent="center">
              {bottomRow.map((tile) => (
                <Grid
                  item
                  key={tile.key}
                  xs={12}
                  sm={6}
                  md={6}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Paper
                    onClick={() => navigate(tile.path)}
                    elevation={3}
                    sx={{
                      width: isMdUp ? 300 : "100%",
                      height: isMdUp ? 180 : 140,
                      border: "2px solid",
                      borderColor: "grey.400",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Typography variant="h6">{tile.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
