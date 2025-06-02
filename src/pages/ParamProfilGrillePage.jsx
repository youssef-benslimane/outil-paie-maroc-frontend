// src/pages/ParamProfilGrillePage.jsx
import React, { useState, useEffect, useCallback } from "react";
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
  createOne,
  updateOne,
  deleteOne,
} from "../api/fakeProfilGrilleApi.js";

function formatDateFR(d) {
  return d ? new Date(d).toLocaleDateString("fr-FR") : "";
}

const drawerWidth = 240;
const tabConfig = [
  { key: "profils", label: "Profils" },
  { key: "grilles", label: "Grilles salariales" },
];

const columns = {
  profils: [
    "Nom du profil",
    "Catégorie associée",
    "Fonction / Poste type",
    "Salaire de base",
    "Primes associées",
    "Date début",
    "Date fin",
  ],
  grilles: [
    "Profil concerné",
    "Niveau",
    "Échelon",
    "Ancienneté min.",
    "Salaire min.",
    "Date début",
    "Date fin",
  ],
};

const fieldKeys = {
  profils: [
    "nom",
    "categorie",
    "poste",
    "salaireBase",
    "primes",
    "debut",
    "fin",
  ],
  grilles: [
    "profil",
    "niveau",
    "echelon",
    "ancienneteMin",
    "salaireMin",
    "debut",
    "fin",
  ],
};

export default function ParamProfilGrillePage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [activeTab, setActiveTab] = useState("profils");
  const [data, setData] = useState({ profils: [], grilles: [] });
  const [search, setSearch] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    sev: "success",
  });

  const showSnack = (msg, sev = "success") =>
    setSnack({ open: true, msg, sev });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const fetchData = useCallback(async () => {
    const ps = await getAll("profils");
    const gs = await getAll("grilles");
    setData({ profils: ps, grilles: gs });
  }, []);

  useEffect(() => {
    fetchData();
    window.history.replaceState({}, "");
  }, [fetchData]);

  const filtered = data[activeTab].filter((row) =>
    fieldKeys[activeTab].some((k) =>
      String(row[k]).toLowerCase().includes(search.toLowerCase())
    )
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [splitOpen, setSplitOpen] = useState(false);
  const [splitDate, setSplitDate] = useState("");
  const [splitForm, setSplitForm] = useState(null);

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

  const handleSplitClick = async (id) => {
    const rec = await getOne(activeTab, id);
    setSplitForm(rec);
    setSplitDate(rec.fin);
    setSplitOpen(true);
  };
  const confirmSplit = async () => {
    await updateOne(activeTab, splitForm.id, { fin: splitDate });
    const next = new Date(splitDate);
    next.setDate(next.getDate() + 1);
    const dd = next.toISOString().slice(0, 10);
    const copy = { ...splitForm, debut: dd, fin: splitForm.fin };
    delete copy.id;
    await createOne(activeTab, copy);
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
            Paramétrage des profils & grilles salariales
          </Typography>

          {/* Onglets + recherche + créer */}
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
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    minWidth: 100,
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
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: isMdUp ? 240 : "100%" }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateOpen(true)}
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
                      {fieldKeys[activeTab].map((k) => (
                        <TableCell key={k}>
                          {k === "debut" || k === "fin"
                            ? formatDateFR(row[k])
                            : Array.isArray(row[k])
                            ? row[k].join(", ")
                            : row[k]}
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
                        <IconButton
                          size="small"
                          onClick={() => confirmDelete(row.id)}
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

      {/* Split */}
      <Dialog
        open={splitOpen}
        onClose={() => setSplitOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Délimiter la période</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
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

      {/* Feedback */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeSnack} severity={snack.sev} sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
