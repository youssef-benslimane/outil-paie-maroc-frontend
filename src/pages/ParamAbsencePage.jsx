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
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "../api/fakeAbsenceApi.js";

// Pour formater en JJ/MM/AAAA
function formatDateFR(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR");
}

const drawerWidth = 240;

// Comme un seul onglet, mais on garde la structure
const tabConfig = [{ key: "typeAbsence", label: "Types d’absences" }];

const columns = {
  typeAbsence: [
    "Nom",
    "Code",
    "Justificatif requis",
    "Absence rémunérée",
    "Impact solde",
    "Date Début",
    "Date Fin",
  ],
};

const fieldKeys = {
  typeAbsence: [
    "nom",
    "code",
    "justificatif",
    "remunere",
    "impactSolde",
    "debut",
    "fin",
  ],
};

const labelMap = {
  nom: "Nom du type d’absence",
  code: "Code",
  justificatif: "Justificatif requis",
  remunere: "Absence rémunérée",
  impactSolde: "Impact solde de congé",
  debut: "Date de début",
  fin: "Date de fin",
};

export default function ParamAbsencePage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const initialTab = location.state?.tab || "typeAbsence";

  const [activeTab] = useState(initialTab);
  const [data, setData] = useState({ typeAbsence: [] });
  const [search, setSearch] = useState("");

  // Snackbar feedback
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });
  const showSnack = (msg, sev = "success") =>
    setSnack({ open: true, msg, sev });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // Dialogs create/edit/delete/split
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
    const list = await getAll("typeAbsence");
    setData({ typeAbsence: list });
  }, []);

  useEffect(() => {
    fetchData();
    window.history.replaceState({}, "");
  }, [fetchData]);

  // Filtrage simple
  const filtered = data.typeAbsence.filter((row) =>
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
    await deleteOne("typeAbsence", deleteId);
    setDeleteOpen(false);
    fetchData();
    showSnack("Type d’absence supprimé", "info");
  };

  // Découpage de période
  const handleSplitClick = async (id) => {
    const rec = await getOne("typeAbsence", id);
    setSplitForm(rec);
    setSplitDate(rec.fin);
    setSplitOpen(true);
  };
  const confirmSplit = async () => {
    if (!splitForm) return;
    const d0 = new Date(splitForm.debut),
      d1 = new Date(splitForm.fin),
      ds = new Date(splitDate);
    if (ds <= d0 || ds >= d1) {
      return alert("Date hors période !");
    }
    // on met à jour la fin
    await updateOne("typeAbsence", splitForm.id, { fin: splitDate });
    // préparation création seconde période
    const next = new Date(splitDate);
    next.setDate(next.getDate() + 1);
    const yyyy = next.getFullYear(),
      mm = String(next.getMonth() + 1).padStart(2, "0"),
      dd = String(next.getDate()).padStart(2, "0");
    setNewDebut(`${yyyy}-${mm}-${dd}`);
    setOrigFin(splitForm.fin);
    // on strip date pour formulaire
    const keys = fieldKeys.typeAbsence.filter(
      (k) => !["debut", "fin"].includes(k)
    );
    const init = {};
    keys.forEach((k) => (init[k] = splitForm[k]));
    setRemainForm(init);
    setSplitOpen(false);
    setRemainOpen(true);
    showSnack("Période découpée");
  };
  const confirmRemain = async () => {
    await createOne("typeAbsence", {
      ...remainForm,
      debut: newDebut,
      fin: origFin,
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
            Paramétrage des absences
          </Typography>

          {/* Actions */}
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

          {/* Tableau */}
          <Paper>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.typeAbsence.map((c) => (
                      <TableCell key={c}>{c}</TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id}>
                      {fieldKeys.typeAbsence.map((f) => (
                        <TableCell key={f}>
                          {f === "debut" || f === "fin"
                            ? formatDateFR(row[f])
                            : typeof row[f] === "boolean"
                            ? row[f]
                              ? "Oui"
                              : "Non"
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
                        <IconButton
                          size="small"
                          onClick={() => {
                            setDeleteId(row.id);
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
            {["nom", "code", "justificatif", "remunere", "impactSolde"].map(
              (key) =>
                key.startsWith("just") ||
                key.startsWith("remu") ||
                key.startsWith("impact") ? (
                  <FormControlLabel
                    key={key}
                    control={
                      <Switch
                        name={key}
                        checked={remainForm[key] || false}
                        onChange={(e) =>
                          setRemainForm((f) => ({
                            ...f,
                            [key]: e.target.checked,
                          }))
                        }
                      />
                    }
                    label={labelMap[key]}
                  />
                ) : (
                  <TextField
                    key={key}
                    fullWidth
                    label={labelMap[key]}
                    name={key}
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
