// src/pages/ParamBulletinPaiePage.jsx
import React, { useState, useEffect, useCallback } from "react";
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

// Configuration des trois onglets
const tabConfig = [
  { key: "onglet1", label: "Champs affichables" },
  { key: "onglet2", label: "Rubriques disponibles" },
  { key: "onglet3", label: "Cotisations" },
];

// Colonnes pour l’Onglet 2 (Rubriques) et Onglet 3 (Cotisations)
const columns = {
  onglet2: ["Nom de la rubrique", "Type de rubrique", "Afficher sur bulletin"],
  onglet3: ["Nom de la cotisation", "Afficher sur bulletin"],
};

// Liste des champs de l’onglet 1
const champFields = [
  { id: "numCnssSociete", label: "Numéro CNSS société" },
  { id: "idFiscalSociete", label: "ID Fiscal société" },
  { id: "numIceSociete", label: "Numéro ICE société" },
  { id: "numCnssEmploye", label: "Numéro CNSS employé" },
  { id: "numCimrEmploye", label: "Numéro CIMR employé" },
];

export default function ParamBulletinPaiePage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // Onglet actif
  const [activeTab, setActiveTab] = useState("onglet1");

  // ─── Onglet 1 ───
  // États “Afficher sur bulletin” pour chaque champ : { id: boolean }
  const [champsVisible, setChampsVisible] = useState(() => {
    const init = {};
    champFields.forEach((f) => {
      init[f.id] = false;
    });
    return init;
  });
  // Texte de recherche pour l’onglet 1
  const [champSearch, setChampSearch] = useState("");

  // ─── Onglet 2 ───
  // Liste des rubriques (simulée)
  const [rubriquesData, setRubriquesData] = useState([]);
  // États “Afficher sur bulletin” pour chaque rubrique : { id: boolean }
  const [rubriquesVisible, setRubriquesVisible] = useState({});
  // Texte de recherche pour les rubriques
  const [rubriqueSearch, setRubriqueSearch] = useState("");

  // ─── Onglet 3 ───
  // Liste des cotisations (simulée)
  const [cotisationsData, setCotisationsData] = useState([]);
  // États “Afficher sur bulletin” pour chaque cotisation : { id: boolean }
  const [cotisationsVisible, setCotisationsVisible] = useState({});
  // Texte de recherche pour les cotisations
  const [cotisationSearch, setCotisationSearch] = useState("");

  // Snackbar pour retours d’action
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success",
  });
  const showSnack = (msg, sev = "info") =>
    setSnack({ open: true, msg, severity: sev });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // Simuler un fetch des rubriques
  const fetchRubriques = useCallback(async () => {
    const fakeRubriques = [
      { id: 1, nom: "Salaire de base", type: "Gain" },
      { id: 2, nom: "Primes", type: "Gain" },
      { id: 3, nom: "Cotisation CNSS", type: "Retenue" },
      { id: 4, nom: "Cotisation CIMR", type: "Retenue" },
      { id: 5, nom: "Cotisation AMO", type: "Retenue" },
    ];
    setRubriquesData(fakeRubriques);
    const initialVisible = {};
    fakeRubriques.forEach((r) => {
      initialVisible[r.id] = false;
    });
    setRubriquesVisible(initialVisible);
  }, []);

  // Simuler un fetch des cotisations
  const fetchCotisations = useCallback(async () => {
    const fakeCotis = [
      { id: 1, nom: "CNSS" },
      { id: 2, nom: "CIMR" },
      { id: 3, nom: "AMO" },
      { id: 4, nom: "IR" },
    ];
    setCotisationsData(fakeCotis);
    const initialVisible = {};
    fakeCotis.forEach((c) => {
      initialVisible[c.id] = false;
    });
    setCotisationsVisible(initialVisible);
  }, []);

  // Chargement initial pour Onglet 2 et Onglet 3
  useEffect(() => {
    fetchRubriques();
    fetchCotisations();
  }, [fetchRubriques, fetchCotisations]);

  // Gestion changement onglet
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  // Handlers “Afficher sur bulletin” onglet 1
  const handleChampToggle = (id, label) => {
    setChampsVisible((prev) => {
      const nv = { ...prev, [id]: !prev[id] };
      showSnack(
        nv[id]
          ? `${label} affiché sur le bulletin`
          : `${label} masqué du bulletin`,
        "info"
      );
      return nv;
    });
  };

  const handleChampCancel = () => {
    const reset = {};
    champFields.forEach((f) => {
      reset[f.id] = false;
    });
    setChampsVisible(reset);
    showSnack("Modifications annulées", "info");
  };

  const handleChampSave = () => {
    // Appel API de sauvegarde si nécessaire
    showSnack("Modifications enregistrées", "success");
  };

  // Handlers “Afficher sur bulletin” onglet 2
  const handleRubriqueToggle = (id) => {
    setRubriquesVisible((prev) => {
      const nv = { ...prev, [id]: !prev[id] };
      showSnack(
        nv[id]
          ? "Rubrique ajoutée au bulletin"
          : "Rubrique retirée du bulletin",
        "info"
      );
      return nv;
    });
  };

  const handleRubriqueCancel = () => {
    const reset = {};
    rubriquesData.forEach((r) => {
      reset[r.id] = false;
    });
    setRubriquesVisible(reset);
    showSnack("Modifications annulées", "info");
  };

  const handleRubriqueSave = () => {
    // Appel API de sauvegarde si nécessaire
    showSnack("Modifications enregistrées", "success");
  };

  // Handlers “Afficher sur bulletin” onglet 3
  const handleCotisationToggle = (id) => {
    setCotisationsVisible((prev) => {
      const nv = { ...prev, [id]: !prev[id] };
      showSnack(
        nv[id]
          ? "Cotisation ajoutée au bulletin"
          : "Cotisation retirée du bulletin",
        "info"
      );
      return nv;
    });
  };

  const handleCotisationCancel = () => {
    const reset = {};
    cotisationsData.forEach((c) => {
      reset[c.id] = false;
    });
    setCotisationsVisible(reset);
    showSnack("Modifications annulées", "info");
  };

  const handleCotisationSave = () => {
    // Appel API de sauvegarde si nécessaire
    showSnack("Modifications enregistrées", "success");
  };

  // Filtrer les champs selon champSearch
  const filteredChamps = champFields.filter((f) =>
    f.label.toLowerCase().includes(champSearch.toLowerCase())
  );

  // Filtrer les rubriques selon rubriqueSearch
  const filteredRubriques = rubriquesData.filter(
    (r) =>
      r.nom.toLowerCase().includes(rubriqueSearch.toLowerCase()) ||
      r.type.toLowerCase().includes(rubriqueSearch.toLowerCase())
  );

  // Filtrer les cotisations selon cotisationSearch
  const filteredCotisations = cotisationsData.filter((c) =>
    c.nom.toLowerCase().includes(cotisationSearch.toLowerCase())
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
            Paramétrage Bulletin de paie
          </Typography>

          {/* Onglets */}
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
                      <TableCell>Afficher sur bulletin</TableCell>
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
                <Button onClick={handleChampCancel}>Annuler</Button>
                <Button variant="contained" onClick={handleChampSave}>
                  Sauvegarder
                </Button>
              </Box>
            </Paper>
          )}

          {/* Onglet 2 : Rubriques disponibles */}
          {activeTab === "onglet2" && (
            <Paper sx={{ p: 2, mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Rubriques disponibles
                </Typography>
                <TextField
                  size="small"
                  placeholder="Rechercher…"
                  value={rubriqueSearch}
                  onChange={(e) => setRubriqueSearch(e.target.value)}
                />
              </Box>
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {columns["onglet2"].map((col) => (
                        <TableCell key={col}>{col}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRubriques.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.nom}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={rubriquesVisible[row.id] || false}
                            onChange={() => handleRubriqueToggle(row.id)}
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
                <Button onClick={handleRubriqueCancel}>Annuler</Button>
                <Button variant="contained" onClick={handleRubriqueSave}>
                  Sauvegarder
                </Button>
              </Box>
            </Paper>
          )}

          {/* Onglet 3 : Cotisations */}
          {activeTab === "onglet3" && (
            <Paper sx={{ p: 2, mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Cotisations pour le bulletin
                </Typography>
                <TextField
                  size="small"
                  placeholder="Rechercher…"
                  value={cotisationSearch}
                  onChange={(e) => setCotisationSearch(e.target.value)}
                />
              </Box>
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {columns["onglet3"].map((col) => (
                        <TableCell key={col}>{col}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCotisations.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.nom}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={cotisationsVisible[row.id] || false}
                            onChange={() => handleCotisationToggle(row.id)}
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
                <Button onClick={handleCotisationCancel}>Annuler</Button>
                <Button variant="contained" onClick={handleCotisationSave}>
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
