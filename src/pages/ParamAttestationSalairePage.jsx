// src/pages/ParamAttestationSalairePage.jsx
import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Toolbar,
  Container,
  Typography,
  TextField,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Snackbar,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ConfigurateurSidebar from "../components/ConfigurateurSidebar.jsx";

const drawerWidth = 240;

// Configuration de l’onglet unique
const tabConfig = [{ key: "onglet1", label: "Champs affichables" }];

// Champs proposés pour l’attestation de salaire
const champFields = [
  { id: "nationalite", label: "Nationalité du salarié" },
  { id: "dateNaissance", label: "Date de naissance du salarié" },
  { id: "adresse", label: "Adresse du salarié" },
  { id: "cin", label: "CIN du salarié" },
  { id: "cnss", label: "ID CNSS" },
];

export default function ParamAttestationSalairePage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [activeTab, setActiveTab] = useState("onglet1");

  // États “Afficher sur attestation” pour chaque champ
  const [champsVisible, setChampsVisible] = useState(() => {
    const init = {};
    champFields.forEach((f) => {
      init[f.id] = false;
    });
    return init;
  });
  // Texte de recherche pour l’onglet
  const [champSearch, setChampSearch] = useState("");

  // Snackbar
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "info",
  });
  const showSnack = (msg, sev = "info") =>
    setSnack({ open: true, msg, severity: sev });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleChampToggle = (id, label) => {
    setChampsVisible((prev) => {
      const nv = { ...prev, [id]: !prev[id] };
      showSnack(
        nv[id]
          ? `${label} affiché sur l’attestation`
          : `${label} masqué de l’attestation`,
        "info"
      );
      return nv;
    });
  };

  const handleCancel = () => {
    // Réinitialise tous les champs à false
    const reset = {};
    champFields.forEach((f) => {
      reset[f.id] = false;
    });
    setChampsVisible(reset);
    showSnack("Modifications annulées", "info");
  };

  const handleSave = () => {
    // Ici, vous pouvez appeler votre API pour sauvegarder les états
    showSnack("Modifications enregistrées", "success");
  };

  const filteredChamps = champFields.filter((f) =>
    f.label.toLowerCase().includes(champSearch.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex" }}>
      <ConfigurateurSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Paramétrage Attestation de salaire
          </Typography>

          {/* Onglet unique */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMdUp ? "row" : "column",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              gap: 2,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              textColor="primary"
              indicatorColor="primary"
              sx={{ flexGrow: 1, justifyContent: "center" }}
            >
              {tabConfig.map((t) => (
                <Tab
                  key={t.key}
                  label={t.label}
                  value={t.key}
                  sx={{ fontWeight: 600, textTransform: "none", minWidth: 120 }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Onglet 1 : Tableau des champs */}
          {activeTab === "onglet1" && (
            <Paper sx={{ p: 2, mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Champs affichables
                </Typography>
                <TextField
                  size="small"
                  placeholder="Rechercher…"
                  value={champSearch}
                  onChange={(e) => setChampSearch(e.target.value)}
                />
              </Box>
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Champ</TableCell>
                      <TableCell>Afficher sur attestation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredChamps.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>{field.label}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={champsVisible[field.id]}
                            onChange={() =>
                              handleChampToggle(field.id, field.label)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button onClick={handleCancel}>Annuler</Button>
                <Button variant="contained" onClick={handleSave}>
                  Sauvegarder
                </Button>
              </Box>
            </Paper>
          )}
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
