// src/pages/ParamBaremeIR.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  Toolbar,
  Container,
  Typography,
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
  TextField,
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
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ConfigurateurSidebar from "../components/ConfigurateurSidebar.jsx";
import CreateEntityDialog from "../components/CreateEntityDialog.jsx";
import EditEntityDialog from "../components/EditEntityDialog.jsx";
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "../api/fakeBaremeApi.js";

// formater JJ/MM/AAAA
function formatDateFR(d) {
  return d ? new Date(d).toLocaleDateString("fr-FR") : "";
}

const drawerWidth = 240;
const tabConfig = [
  { key: "tranches", label: "Tranches IR" },
  { key: "plafonds", label: "Constantes & Plafond" },
];

// colonnes de chaque onglet
const columns = {
  tranches: [
    "Seuil minimal",
    "Seuil maximal",
    "Taux (%)",
    "Déduction forfaitaire",
    "Date début",
    "Date fin",
  ],
  plafonds: ["Code", "Nom", "Valeur", "Date début", "Date fin"],
};

// clés des champs renvoyés par l'API
const fieldKeys = {
  tranches: ["minimum", "maximum", "taux", "deduction", "debut", "fin"],
  plafonds: ["code", "nom", "valeur", "debut", "fin"],
};

export default function ParamBaremeIR() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const initialTab = location.state?.tab || "tranches";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [data, setData] = useState({ tranches: [], plafonds: [] });
  const [search, setSearch] = useState("");

  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success",
  });
  const showSnack = (msg, severity = "success") =>
    setSnack({ open: true, msg, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [splitOpen, setSplitOpen] = useState(false);
  const [splitDate, setSplitDate] = useState("");
  const [splitForm, setSplitForm] = useState(null);

  const fetchData = useCallback(async () => {
    const tr = await getAll("tranches");
    const pl = await getAll("plafonds");
    setData({ tranches: tr, plafonds: pl });
  }, []);

  useEffect(() => {
    fetchData();
    window.history.replaceState({}, "");
  }, [fetchData]);

  // filtrage
  const filtered = data[activeTab].filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  // handlers création / maj / suppression
  const onCreated = useCallback(() => {
    fetchData();
    showSnack("Création réussie");
  }, [fetchData]);

  const onUpdated = useCallback(() => {
    fetchData();
    showSnack("Modification enregistrée");
  }, [fetchData]);

  const confirmDelete = async (id) => {
    await deleteOne(activeTab, id);
    fetchData();
    showSnack("Suppression effectuée", "info");
  };

  // découpage de période
  const handleSplitClick = async (id) => {
    const rec = await getOne(activeTab, id);
    setSplitForm(rec);
    setSplitDate(rec.fin);
    setSplitOpen(true);
  };
  const confirmSplit = async () => {
    if (!splitForm) return;
    // met à jour fin
    await updateOne(activeTab, splitForm.id, { fin: splitDate });
    // crée nouvelle période
    const next = new Date(splitDate);
    next.setDate(next.getDate() + 1);
    const dd = next.toISOString().slice(0, 10);
    const initial = { ...splitForm, debut: dd, fin: splitForm.fin };
    delete initial.id;
    await createOne(activeTab, initial);
    setSplitOpen(false);
    fetchData();
    showSnack("Période découpée");
  };

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
            Paramétrage du barème IR
          </Typography>

          {/* onglets + recherche + créer */}
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
              onChange={(_, v) => {
                setActiveTab(v);
                setSearch("");
              }}
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
                  sx={{ fontWeight: 600, textTransform: "none", minWidth: 80 }}
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
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: isMdUp ? 240 : "100%" }}
              />
              {/* bouton "Créer" uniquement sur le 1er onglet */}
              {activeTab === "tranches" && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateOpen(true)}
                >
                  Créer
                </Button>
              )}
            </Box>
          </Box>

          {/* tableau */}
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
                            : f === "taux"
                            ? // Ajout du symbole % pour le taux IR
                              `${row[f]} %`
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
                          onClick={() => {
                            setEditId(row.id);
                            setEditOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        {activeTab === "tranches" && (
                          <IconButton
                            size="small"
                            onClick={() => confirmDelete(row.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Dialogs */}
      <CreateEntityDialog
        open={createOpen}
        entity={activeTab}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />
      <EditEntityDialog
        open={editOpen}
        entity={activeTab}
        id={editId}
        onClose={() => setEditOpen(false)}
        onUpdated={onUpdated}
      />

      {/* Split-period dialog */}
      <Dialog
        open={splitOpen}
        onClose={() => setSplitOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Délimiter la période</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Choisissez la date de fin de la première partie
          </Typography>
          <TextField
            fullWidth
            label="Date de fin"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={splitDate}
            onChange={(e) => setSplitDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSplitOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={confirmSplit}>
            Suivant
          </Button>
        </DialogActions>
      </Dialog>

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
