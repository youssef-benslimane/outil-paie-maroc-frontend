// src/pages/ParamCotisationPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  Toolbar,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import ConfigurateurSidebar from "../components/ConfigurateurSidebar.jsx";
import CreateEntityDialog from "../components/CreateEntityDialog.jsx";
import EditEntityDialog from "../components/EditEntityDialog.jsx";
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from "../api/fakeCotisationsApi.js";

const drawerWidth = 240;

// Configuration des onglets
const tabConfig = [
  { key: "typeCot", label: "Type de cotisations" },
  { key: "cotisation", label: "Paramétrage de cotisation" },
];

// Titres de colonnes pour chaque onglet
const columns = {
  typeCot: ["Nom", "Description", "Date Début", "Date Fin"],
  cotisation: [
    "Type",
    "Code",
    "Nom",
    "Taux salarial",
    "Taux patronal",
    "Plafond salarial",
    "Plafond patronal",
    "Date Début",
    "Date Fin",
    "Description",
  ],
};

// Clés des champs dans l'objet renvoyé par l'API
const fieldKeys = {
  typeCot: ["nom", "description", "debut", "fin"],
  cotisation: [
    "type",
    "code",
    "nom",
    "tauxSalarial",
    "tauxPatronal",
    "plafondSalarial",
    "plafondPatronal",
    "debut",
    "fin",
    "description",
  ],
};

// Étiquettes plus lisibles pour les formulaires
const labelMap = {
  nom: "Nom",
  description: "Description",
  debut: "Date de début",
  fin: "Date de fin",
  type: "Type de cotisation",
  code: "Code de la cotisation",
  tauxSalarial: "Taux salarial (%)",
  tauxPatronal: "Taux patronal (%)",
  plafondSalarial: "Plafond salarial",
  plafondPatronal: "Plafond patronal",
};

function formatDateFR(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

export default function ParamCotisationPage() {
  const theme = useTheme();
  // On considère mobile jusqu'à 899px inclus
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const initialTab = location.state?.tab || "typeCot";

  // États principaux
  const [activeTab, setActiveTab] = useState(initialTab);
  const [data, setData] = useState({ typeCot: [], cotisation: [] });
  const [search, setSearch] = useState("");

  // Snackbar pour feedback
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success",
  });
  const showSnack = (msg, severity = "success") =>
    setSnack({ open: true, msg, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // Dialog création
  const [createOpen, setCreateOpen] = useState(false);
  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);
  const onCreated = useCallback(() => {
    fetchData(activeTab);
    showSnack("Création réussie");
  }, [activeTab]);

  // Dialog édition
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const openEdit = (id) => {
    setEditId(id);
    setEditOpen(true);
  };
  const closeEdit = () => setEditOpen(false);
  const onUpdated = useCallback(() => {
    fetchData(activeTab);
    showSnack("Modification enregistrée");
  }, [activeTab]);

  // Dialog suppression
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const openDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };
  const closeDelete = () => setDeleteOpen(false);
  const confirmDelete = async () => {
    await deleteOne(activeTab, deleteId);
    closeDelete();
    fetchData(activeTab);
    showSnack("Entrée supprimée", "info");
  };

  // Dialog découpage de période
  const [splitOpen, setSplitOpen] = useState(false);
  const [splitForm, setSplitForm] = useState(null);
  const [splitDate, setSplitDate] = useState("");
  const [splitError, setSplitError] = useState("");

  // Dialog édition des champs restants
  const [remainOpen, setRemainOpen] = useState(false);
  const [remainForm, setRemainForm] = useState({});
  const [newDebut, setNewDebut] = useState("");
  const [origFin, setOrigFin] = useState("");

  // Chargement des données
  const fetchData = async (tab) => {
    const list = await getAll(tab);
    setData((d) => ({ ...d, [tab]: list }));
  };
  useEffect(() => {
    fetchData(activeTab);
    window.history.replaceState({}, "");
  }, [activeTab]);

  // Filtrage basique
  const filtered = data[activeTab].filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Handlers
  const handleTabChange = (_, v) => {
    setActiveTab(v);
    setSearch("");
  };
  const handleSearch = (e) => setSearch(e.target.value);

  // Découpage de période
  const handleSplitClick = async (id) => {
    const rec = await getOne(activeTab, id);
    setSplitForm(rec);
    setSplitDate(rec.fin);
    setSplitError("");
    setSplitOpen(true);
  };
  const cancelSplit = () => setSplitOpen(false);
  const confirmSplit = async () => {
    if (!splitForm) return;
    const d0 = new Date(splitForm.debut),
      d1 = new Date(splitForm.fin),
      ds = new Date(splitDate);
    if (ds < d0 || ds >= d1) {
      setSplitError("Date de séparation hors période !");
      return;
    }
    // Met à jour la fin de la première période
    await updateOne(activeTab, splitForm.id, { fin: splitDate });
    // Prépare la seconde période
    const next = new Date(splitDate);
    next.setDate(next.getDate() + 1);
    const yyyy = next.getFullYear(),
      mm = String(next.getMonth() + 1).padStart(2, "0"),
      dd = String(next.getDate()).padStart(2, "0");
    setNewDebut(`${yyyy}-${mm}-${dd}`);
    setOrigFin(splitForm.fin);
    // Construit le formulaire sans dates
    const keys = fieldKeys[activeTab].filter(
      (k) => k !== "debut" && k !== "fin"
    );
    const init = {};
    keys.forEach((k) => (init[k] = splitForm[k]));
    setRemainForm(init);
    setSplitOpen(false);
    setRemainOpen(true);
    showSnack("Période découpée");
  };
  const handleRemainChange = (e) => {
    const { name, value } = e.target;
    setRemainForm((f) => ({ ...f, [name]: value }));
  };
  const confirmRemain = async () => {
    await createOne(activeTab, {
      ...remainForm,
      debut: newDebut,
      fin: origFin,
    });
    setRemainOpen(false);
    fetchData(activeTab);
    showSnack("Nouvelle période créée");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <ConfigurateurSidebar />

      {/* Main content */}
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
            Paramétrage des cotisations
          </Typography>

          {/* Onglets + Recherche + Créer */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMdUp ? "row" : "column",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              gap: 2,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ flexGrow: 1, justifyContent: "center" }}
              textColor="primary"
              indicatorColor="primary"
            >
              {tabConfig.map((t) => (
                <Tab
                  key={t.key}
                  label={t.label}
                  value={t.key}
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: {
                      xs: "0.75rem",
                      sm: "0.75rem", // même style que xs
                      md: "1rem",
                    },
                  }}
                />
              ))}
            </Tabs>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: isMdUp ? "auto" : "100%",
                justifyContent: isMdUp ? "flex-end" : "flex-start",
              }}
            >
              <TextField
                size="small"
                placeholder="Rechercher…"
                value={search}
                onChange={handleSearch}
                sx={{ width: isMdUp ? 240 : "100%" }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreate}
              >
                Créer
              </Button>
            </Box>
          </Box>

          {/* Tableau */}
          <Paper>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns[activeTab].map((col) => (
                      <TableCell key={col}>{col}</TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id}>
                      {fieldKeys[activeTab].map((f) => (
                        <TableCell key={f}>
                          {f === "debut" || f === "fin"
                            ? formatDateFR(row[f])
                            : row[f]}
                        </TableCell>
                      ))}
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleSplitClick(row.id)}
                        >
                          <EditCalendarIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => openEdit(row.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => openDelete(row.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* — Dialogs génériques — */}

      {/* Dialog création */}
      <CreateEntityDialog
        open={createOpen}
        entity={activeTab}
        onClose={closeCreate}
        onCreated={onCreated}
      />

      {/* Dialog édition */}
      <EditEntityDialog
        open={editOpen}
        entity={activeTab}
        id={editId}
        onClose={closeEdit}
        onUpdated={onUpdated}
      />

      {/* Dialog suppression */}
      <Dialog open={deleteOpen} onClose={closeDelete}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Voulez-vous supprimer cet élément ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete}>Annuler</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog découpage de période */}
      <Dialog open={splitOpen} onClose={cancelSplit} fullWidth maxWidth="xs">
        <DialogTitle>Délimiter la période</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Choisissez la date de fin de la première partie
          </Typography>
          <TextField
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={splitDate}
            onChange={(e) => setSplitDate(e.target.value)}
          />
          {splitError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {splitError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelSplit}>Annuler</Button>
          <Button variant="contained" onClick={confirmSplit}>
            Suivant
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour compléter la seconde période */}
      <Dialog
        open={remainOpen}
        onClose={() => setRemainOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Modifier les champs restants</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {Object.keys(remainForm).map((key) => (
              <TextField
                key={key}
                fullWidth
                label={labelMap[key] || key}
                name={key}
                value={remainForm[key]}
                onChange={handleRemainChange}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemainOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={confirmRemain}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de feedback */}
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
