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
} from "../api/paramCotisationsApi.js";

const drawerWidth = 240;

const tabConfig = [
  { key: "typeCot", label: "Type de cotisation" },
  { key: "cotisation", label: "Paramétrage de cotisation" },
];

const columns = {
  typeCot: ["Code", "Nom", "Description", "Date Début", "Date Fin"],
  cotisation: [
    "Nom",
    "Description",
    "Type",
    "Taux salarial",
    "Taux patronal",
    "Plafond salarial",
    "Plafond patronal",
    "Date Début",
    "Date Fin",
  ],
};

const fieldKeys = {
  typeCot: [
    "codeCotisation",
    "nomCotisation",
    "description",
    "dateDebut",
    "dateFin",
  ],
  cotisation: [
    "nom",
    "description",
    "typeCotisation",
    "tauxSalarial",
    "tauxPatronal",
    "plafondSalarial",
    "plafondPatronal",
    "dateDebut",
    "dateFin",
  ],
};

const labelMap = {
  codeCotisation: "Code",
  nomCotisation: "Nom",
  description: "Description",
  dateDebut: "Date Début",
  dateFin: "Date Fin",
  type: "Type de cotisation",
  code: "Code de la cotisation",
  nom: "Nom de la cotisation",
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
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const initialTab = location.state?.tab || "typeCot";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [data, setData] = useState({ typeCot: [], cotisation: [] });
  const [search, setSearch] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const showSnack = (msg, sev = "success") => {
    setSnackMsg(msg);
    setSnackSeverity(sev);
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
    showSnack("Enregistrement supprimé", "info");
  };

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

  const handleTabChange = (_, v) => {
    setActiveTab(v);
    setSearch("");
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
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            noWrap
            sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
          >
            Paramétrage des cotisations
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
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.75rem", md: "1rem" },
                    minWidth: 90,
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
                    const rowId =
                      activeTab === "typeCot"
                        ? row.idTypeCotisation
                        : row.idCotisation;
                    return (
                      <TableRow key={rowId}>
                        {fieldKeys[activeTab].map((f) => (
                          <TableCell key={f}>
                            {["dateDebut", "dateFin", "debut", "fin"].includes(
                              f
                            )
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
                            onClick={() => openEdit(rowId)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openDelete(rowId)}
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
        open={editOpen}
        entity={activeTab}
        id={editId}
        onClose={closeEdit}
        onUpdated={onUpdated}
      />

      <Dialog open={deleteOpen} onClose={closeDelete}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cet enregistrement ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete}>Annuler</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Supprimer
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

// N’oublie pas de déclarer handleSplitClick si tu utilises la fonctionnalité de découpage de période !
