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
} from "../api/paramAdminApi.js";

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
    "Nom Société",
    "Adresse",
    "Ville",
    "Identifiant fiscal",
    "Numéro CNSS",
    "Numéro ICE",
    "Numéro RC",
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
    "Raison inactivité",
    "Date Début",
    "Date Fin",
  ],
  unite: [
    "Code unité", // 1
    "Nom unité", // 2
    "Type unité", // 3
    "Unité parent", // 4
    "Description", // 5
    "Date Début", // 6
    "Date Fin", // 7
  ],
};

const fieldKeys = {
  societe: [
    "nomSociete",
    "adresse",
    "ville",
    "identifiantFiscal",
    "numeroCnss",
    "numeroIce",
    "numeroRc",
    "dateDebut",
    "dateFin",
  ],
  contrat: [
    "codeContrat",
    "nomContrat",
    "periodeEssai",
    "conditionsSpecifiques",
    "dateDebut",
    "dateFin",
  ],
  categorie: [
    "codeCategorie",
    "nomCategorie",
    "descriptionCategorie",
    "dateDebut",
    "dateFin",
  ],
  statut: [
    "codeStatut",
    "nomStatut",
    "descriptionStatut",
    "raisonInactivite",
    "dateDebut",
    "dateFin",
  ],
  unite: [
    "codeUnite", // 1 → Code unité
    "nomUnite", // 2 → Nom unité
    "typeUnite", // 3 → Type unité
    "uniteParent", // 4 → Unité parent
    "descriptionUnite", // 5 → Description
    "dateDebut", // 6 → Date Début
    "dateFin", // 7 → Date Fin
  ],
};

const labelMap = {
  idSociete: "ID Société",
  nomSociete: "Nom Société",
  adresse: "Adresse",
  ville: "Ville",
  identifiantFiscal: "Identifiant fiscal",
  numeroCnss: "Numéro CNSS",
  numeroIce: "Numéro ICE",
  numeroRc: "Numéro RC",
  dateDebut: "Date Début",
  dateFin: "Date Fin",
  code: "Code",
  essai: "Période d’essai",
  conditions: "Conditions spécifiques",
  description: "Description",
  type: "Type d’unité",
  parent: "Rattachement hiérarchique",
  statut: "Statut de l’unité",
  codeContrat: "Code du contrat",
  nomContrat: "Nom du contrat",
  periodeEssai: "Période d’essai",
  conditionsSpecifiques: "Conditions",
  codeCategorie: "Code catégorie",
  nomCategorie: "Nom catégorie",
  descriptionCategorie: "Description",
  codeStatut: "Code statut",
  nomStatut: "Nom statut",
  descriptionStatut: "Description",
  raisonInactivite: "Raison inactivité",
  codeUnite: "Code unité",
  nomUnite: "Nom unité",
  typeUnite: "Type unité",
  uniteParent: "Unité parent",
  descriptionUnite: "Description",
};

const entityApiMap = {
  societe: "societes",
  contrat: "types-contrats",
  categorie: "categories-salariales",
  statut: "statuts-salariaux",
  unite: "unites",
};

function formatDateFR(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR");
}

export default function ParamAdminPage() {
  const theme = useTheme();
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

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const showSnack = (msg, severity = "success") => {
    setSnackMsg(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };
  const handleSnackClose = () => setSnackOpen(false);

  const [createOpen, setCreateOpen] = useState(false);
  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);
  const onCreated = useCallback(() => {
    fetchData(activeTab);
    showSnack("Enregistrement créé");
  }, [activeTab]);

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
    showSnack("Modification enregistrée");
  }, [activeTab]);

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
    setSplitDate(rec.dateFin || rec.fin);
    setSplitOpen(true);
  };
  const handleSplitCancel = () => {
    setSplitOpen(false);
    setSplitForm(null);
    setSplitDate("");
  };
  const handleSplitConfirm = async () => {
    if (!splitForm) return;
    const d0 = new Date(splitForm.dateDebut || splitForm.debut);
    const d1 = new Date(splitForm.dateFin || splitForm.fin);
    const ds = new Date(splitDate);
    if (ds < d0 || ds >= d1) {
      setErrorMsg("Date de séparation hors période !");
      setErrorOpen(true);
      return;
    }
    await updateOne(activeTab, splitForm.idSociete ?? splitForm.id, {
      dateFin: splitDate,
      fin: splitDate,
    });
    const next = new Date(splitDate);
    next.setDate(next.getDate() + 1);
    const yyyy = next.getFullYear();
    const mm = String(next.getMonth() + 1).padStart(2, "0");
    const dd = String(next.getDate()).padStart(2, "0");
    setNewDebut(`${yyyy}-${mm}-${dd}`);
    setOrigFin(splitForm.dateFin || splitForm.fin);
    const keys = fieldKeys[activeTab].filter(
      (k) =>
        k !== "dateDebut" && k !== "dateFin" && k !== "debut" && k !== "fin"
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
  const handleRemainConfirm = async () => {
    await createOne(activeTab, {
      ...remainForm,
      dateDebut: newDebut,
      dateFin: origFin,
      debut: newDebut,
      fin: origFin,
    });
    setRemainOpen(false);
    fetchData(activeTab);
    showSnack("Nouvelle période enregistrée");
  };

  const fetchData = async (tab) => {
    const apiEntity = entityApiMap[tab] || tab;
    const list = await getAll(apiEntity);

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
                    fontSize: { xs: "0.75rem", md: "1rem" },
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
                  {filtered.map((row) => {
                    // choisir une clé unique suivant l’entité
                    const rowId =
                      row.id ??
                      row.idSociete ??
                      row.idCategorie ??
                      row.idStatut ??
                      row.idUnite ?? // ← ici
                      row.codeContrat ??
                      row.codeCategorie ??
                      row.codeStatut ??
                      row.codeUnite;
                    return (
                      <TableRow key={rowId}>
                        {fieldKeys[activeTab].map((f) => (
                          <TableCell key={f}>
                            {(f === "dateDebut" || f === "dateFin") && row[f]
                              ? formatDateFR(row[f])
                              : row[f]}
                          </TableCell>
                        ))}
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleSplitClick(rowId)}
                          >
                            <EditCalendarIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(rowId)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openDeleteDialog(rowId)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Container>
      </Box>
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
