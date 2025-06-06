// src/pages/ParamAdminPage.jsx
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
} from "../api/fakeParamAdminApi.js";

const drawerWidth = 240;

const tabConfig = [
  { key: "societe", label: "Société" },
  { key: "contrat", label: "Type de contrat" },
  { key: "categorie", label: "Catégorie de salarié" },
  { key: "statut", label: "Statut du salarié" },
  { key: "unite", label: "Unité organisationnelle" },
];

const columns = {
  societe: [
    "Nom",
    "Ville",
    "ID Fiscal",
    "CNSS",
    "ICE",
    "RC",
    "Date Début",
    "Date Fin",
  ],
  contrat: [
    "Code",
    "Nom",
    "Période d’essai",
    "Conditions",
    "Date Début",
    "Date Fin",
  ],
  categorie: [
    "Code catégorie",
    "Nom catégorie",
    "Description",
    "Date Début",
    "Date Fin",
  ],
  statut: [
    "Code statut",
    "Nom statut",
    "Description",
    "Date Début",
    "Date Fin",
  ],
  unite: [
    "Code unité",
    "Nom unité",
    "Type unité",
    "Rattachement",
    "Description",
    "Statut",
    "Date Début",
    "Date Fin",
  ],
};

const fieldKeys = {
  societe: ["nom", "ville", "identFiscal", "cnss", "ice", "rc", "debut", "fin"],
  contrat: ["code", "nom", "essai", "conditions", "debut", "fin"],
  categorie: ["code", "nom", "description", "debut", "fin"],
  statut: ["code", "nom", "description", "debut", "fin"],
  unite: [
    "code",
    "nom",
    "type",
    "parent",
    "description",
    "statut",
    "debut",
    "fin",
  ],
};

const labelMap = {
  nom: "Nom",
  ville: "Ville",
  identFiscal: "Identifiant fiscal",
  cnss: "Numéro CNSS",
  ice: "Numéro ICE",
  rc: "Numéro RC",
  code: "Code",
  essai: "Période d’essai",
  conditions: "Conditions spécifiques",
  description: "Description",
  type: "Type d’unité",
  parent: "Rattachement hiérarchique",
  statut: "Statut de l’unité",
};

function formatDateFR(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  // options fr-FR garantissent jour/mois/année
  return d.toLocaleDateString("fr-FR");
}

export default function ParamAdminPage() {
  const theme = useTheme();
  // mobile layout up to 899px, desktop from 900px
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const initialTab = location.state?.tab || "societe";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [data, setData] = useState({
    societe: [],
    contrat: [],
    categorie: [],
    statut: [],
    unite: [],
  });

  // Snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const showSnack = (msg, severity = "success") => {
    setSnackMsg(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };
  const handleSnackClose = () => setSnackOpen(false);

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);
  const onCreated = useCallback(() => {
    fetchData(activeTab);
    showSnack("Enregistrement créé", "success");
  }, [activeTab]);

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDialogId, setEditDialogId] = useState(null);
  const openEditDialog = (id) => {
    setEditDialogId(id);
    setEditDialogOpen(true);
  };
  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditDialogId(null);
  };
  const onUpdated = useCallback(() => {
    fetchData(activeTab);
    showSnack("Modification enregistrée", "success");
  }, [activeTab]);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    setDeleteId(null);
  };
  const handleDeleteConfirm = async () => {
    await deleteOne(activeTab, deleteId);
    closeDeleteDialog();
    fetchData(activeTab);
    showSnack("Enregistrement supprimé", "info");
  };

  // Split-period dialog
  const [splitOpen, setSplitOpen] = useState(false);
  const [splitForm, setSplitForm] = useState(null);
  const [splitDate, setSplitDate] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [remainOpen, setRemainOpen] = useState(false);
  const [remainForm, setRemainForm] = useState({});
  const [newDebut, setNewDebut] = useState("");
  const [origFin, setOrigFin] = useState("");

  const handleSplitClick = async (id) => {
    const rec = await getOne(activeTab, id);
    setSplitForm(rec);
    setSplitDate(rec.fin);
    setSplitOpen(true);
  };
  const handleSplitCancel = () => {
    setSplitOpen(false);
    setSplitForm(null);
    setSplitDate("");
  };
  const handleSplitConfirm = async () => {
    if (!splitForm) return;
    const d0 = new Date(splitForm.debut),
      d1 = new Date(splitForm.fin),
      ds = new Date(splitDate);
    if (ds < d0 || ds >= d1) {
      setErrorMsg("Date de séparation hors période !");
      setErrorOpen(true);
      return;
    }
    await updateOne(activeTab, splitForm.id, { fin: splitDate });
    const next = new Date(splitDate);
    next.setDate(next.getDate() + 1);
    const yyyy = next.getFullYear(),
      mm = String(next.getMonth() + 1).padStart(2, "0"),
      dd = String(next.getDate()).padStart(2, "0");
    setNewDebut(`${yyyy}-${mm}-${dd}`);
    setOrigFin(splitForm.fin);
    const keys = fieldKeys[activeTab].filter(
      (k) => k !== "debut" && k !== "fin"
    );
    const init = {};
    keys.forEach((k) => (init[k] = splitForm[k]));
    setRemainForm(init);
    setSplitOpen(false);
    setRemainOpen(true);
    showSnack("Période découpée", "success");
  };
  const handleRemainChange = (e) => {
    const { name, value } = e.target;
    setRemainForm((f) => ({ ...f, [name]: value }));
  };
  const handleRemainConfirm = async () => {
    await createOne(activeTab, {
      ...remainForm,
      debut: newDebut,
      fin: origFin,
    });
    setRemainOpen(false);
    fetchData(activeTab);
    showSnack("Nouvelle période enregistrée", "success");
  };

  // Fetch data
  const fetchData = async (tab) => {
    const list = await getAll(tab);
    setData((d) => ({ ...d, [tab]: list }));
  };
  useEffect(() => {
    fetchData(activeTab);
    window.history.replaceState({}, "");
  }, [activeTab]);

  const filtered = data[activeTab].filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
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
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            noWrap
            sx={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            Paramétrage des données administratives
          </Typography>

          {/* Onglets + barre de recherche + bouton Créer */}
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
              onChange={(e, v) => {
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
                    fontSize: {
                      xs: "0.75rem",
                      md: "1rem",
                    },
                    minWidth: 80,
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
                          onClick={() => openEditDialog(row.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => openDeleteDialog(row.id)}
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
        onClose={closeCreate}
        onCreated={onCreated}
      />
      <EditEntityDialog
        open={editDialogOpen}
        entity={activeTab}
        id={editDialogId}
        onClose={closeEditDialog}
        onUpdated={onUpdated}
      />
      <Dialog open={deleteOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cet enregistrement ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Annuler</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={splitOpen}
        onClose={handleSplitCancel}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Délimiter la période</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Choisissez la date de fin de la première partie
          </Typography>
          <TextField
            fullWidth
            label="Date de séparation"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={splitDate}
            onChange={(e) => setSplitDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSplitCancel}>Annuler</Button>
          <Button variant="contained" onClick={handleSplitConfirm}>
            Suivant
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={errorOpen} onClose={() => setErrorOpen(false)}>
        <DialogTitle>Erreur</DialogTitle>
        <DialogContent>
          <Typography>{errorMsg}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={remainOpen}
        onClose={() => setRemainOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Modifier les informations restantes</DialogTitle>
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
          <Button variant="contained" onClick={handleRemainConfirm}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackSeverity}
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
