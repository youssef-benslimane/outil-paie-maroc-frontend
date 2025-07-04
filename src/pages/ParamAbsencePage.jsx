// src/pages/ParamAbsencePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
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
  Stack,
  TextField,
  Switch,
  FormControlLabel,
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
  getAllTypeAbsences,
  getTypeAbsenceById,
  createTypeAbsence,
  updateTypeAbsence,
  deleteTypeAbsence,
} from "../api/paramAbsenceApi.js";

// Pour formater en JJ/MM/AAAA
function formatDateFR(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR");
}

const drawerWidth = 240;
const columns = [
  "Code",
  "Nom",
  "Justificatif requis",
  "Absence rémunérée",
  "Impact solde",
  "Date Début",
  "Date Fin",
];

export default function ParamAbsencePage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const initialTab = location.state?.tab || null;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });
  const showSnack = (msg, sev = "success") =>
    setSnack({ open: true, msg, sev });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [splitOpen, setSplitOpen] = useState(false);
  const [splitForm, setSplitForm] = useState(null);
  const [splitDate, setSplitDate] = useState("");

  const [remainOpen, setRemainOpen] = useState(false);
  const [remainForm, setRemainForm] = useState({});
  const [newDebut, setNewDebut] = useState("");
  const [origFin, setOrigFin] = useState("");

  const fetchData = useCallback(async () => {
    const list = await getAllTypeAbsences();
    setData(list);
  }, []);

  useEffect(() => {
    fetchData();
    window.history.replaceState({}, "");
  }, [fetchData]);

  const filtered = data.filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Création
  const onCreated = useCallback(() => {
    fetchData();
    showSnack("Type d’absence créé");
  }, [fetchData]);

  // Mise à jour
  const onUpdated = useCallback(() => {
    fetchData();
    showSnack("Type d’absence modifié");
  }, [fetchData]);

  // Suppression
  const confirmDelete = async () => {
    await deleteTypeAbsence(deleteId);
    setDeleteOpen(false);
    fetchData();
    showSnack("Type d’absence supprimé", "info");
  };

  // Découpage de période
  const handleSplitClick = async (id) => {
    const rec = await getTypeAbsenceById(id);
    setSplitForm(rec);
    setSplitDate(rec.dateFin?.split("T")[0] || "");
    setSplitOpen(true);
  };
  const confirmSplit = async () => {
    if (!splitForm) return;
    const d0 = new Date(splitForm.dateDebut);
    const d1 = new Date(splitForm.dateFin);
    const ds = new Date(splitDate);
    if (ds <= d0 || ds >= d1) {
      return alert("Date hors période !");
    }
    // on met à jour la fin de la première période
    await updateTypeAbsence(splitForm.idTypeAbsence, { dateFin: splitDate });
    // préparation de la seconde période
    const next = new Date(splitDate);
    next.setDate(next.getDate() + 1);
    const yyyy = next.getFullYear();
    const mm = String(next.getMonth() + 1).padStart(2, "0");
    const dd = String(next.getDate()).padStart(2, "0");
    setNewDebut(`${yyyy}-${mm}-${dd}`);
    setOrigFin(splitForm.dateFin?.split("T")[0] || "");

    // Initialisation du formulaire pour la nouvelle période
    setRemainForm({
      nomAbsence: splitForm.nomAbsence,
      codeAbsence: splitForm.codeAbsence,
      justificatifRequis: splitForm.justificatifRequis,
      absenceRemuneree: splitForm.absenceRemuneree,
      impactSoldeConge: splitForm.impactSoldeConge,
    });

    setSplitOpen(false);
    setRemainOpen(true);
    showSnack("Période découpée");
  };
  const confirmRemain = async () => {
    await createTypeAbsence({
      idTypeAbsence: `${splitForm.idTypeAbsence}-B`, // ou générez un nouvel ID selon votre logique
      ...remainForm,
      dateDebut: newDebut,
      dateFin: origFin,
    });
    setRemainOpen(false);
    fetchData();
    showSnack("Nouvelle période créée");
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
            Paramétrage des types d’absences
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMdUp ? "row" : "column",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mb: 3,
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

          <Paper>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((c) => (
                      <TableCell key={c}>{c}</TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.idTypeAbsence}>
                      <TableCell>{row.codeAbsence}</TableCell>
                      <TableCell>{row.nomAbsence}</TableCell>
                      <TableCell>
                        {row.justificatifRequis ? "Oui" : "Non"}
                      </TableCell>
                      <TableCell>
                        {row.absenceRemuneree ? "Oui" : "Non"}
                      </TableCell>
                      <TableCell>
                        {row.impactSoldeConge ? "Oui" : "Non"}
                      </TableCell>
                      <TableCell>{formatDateFR(row.dateDebut)}</TableCell>
                      <TableCell>{formatDateFR(row.dateFin)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleSplitClick(row.idTypeAbsence)}
                        >
                          <EditCalendarIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditId(row.idTypeAbsence);
                            setEditOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setDeleteId(row.idTypeAbsence);
                            setDeleteOpen(true);
                          }}
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

      {/* Create / Edit */}
      <CreateEntityDialog
        open={createOpen}
        entity="typeAbsence"
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />
      <EditEntityDialog
        open={editOpen}
        entity="typeAbsence"
        id={editId}
        onClose={() => setEditOpen(false)}
        onUpdated={onUpdated}
      />

      {/* Delete */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>Êtes-vous sûr ?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Annuler</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Split */}
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

      {/* Remain */}
      <Dialog
        open={remainOpen}
        onClose={() => setRemainOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Modifier la nouvelle période</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {[
              { key: "nomAbsence", label: "Nom du type d’absence" },
              { key: "codeAbsence", label: "Code" },
              {
                key: "justificatifRequis",
                label: "Justificatif requis",
                type: "switch",
              },
              {
                key: "absenceRemuneree",
                label: "Absence rémunérée",
                type: "switch",
              },
              {
                key: "impactSoldeConge",
                label: "Impact solde de congé",
                type: "switch",
              },
            ].map(({ key, label, type }) =>
              type === "switch" ? (
                <FormControlLabel
                  key={key}
                  control={
                    <Switch
                      checked={remainForm[key] || false}
                      onChange={(e) =>
                        setRemainForm((f) => ({
                          ...f,
                          [key]: e.target.checked,
                        }))
                      }
                    />
                  }
                  label={label}
                />
              ) : (
                <TextField
                  key={key}
                  fullWidth
                  label={label}
                  value={remainForm[key] || ""}
                  onChange={(e) =>
                    setRemainForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                />
              )
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemainOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={confirmRemain}>
            Enregistrer
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
