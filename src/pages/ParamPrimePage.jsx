// src/pages/ParamPrimePage.jsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
} from "../api/fakePrimeApi.js";

// format JJ/MM/AAAA
function formatDateFR(d) {
  return d ? new Date(d).toLocaleDateString("fr-FR") : "";
}

const drawerWidth = 240;

// un seul onglet « Primes & Indemnités »
const tabKey = "prime";
const columns = [
  "Nom",
  "Code interne",
  "Type montant",
  "Montant fixe",
  "Taux (%)",
  "Rubrique source",
  "Valeur unitaire",
  "Soumis cotisation",
  "Soumis IR",
  "Date Début",
  "Date Fin",
];

const fieldKeys = [
  "nom",
  "code",
  "typeMontant",
  "montantFixe",
  "taux",
  "rubriqueSource",
  "valeurUnitaire",
  "soumisCotisation",
  "soumisIR",
  "debut",
  "fin",
];

const labelMap = {
  nom: "Nom de la prime/indemnité",
  code: "Code interne",
  typeMontant: "Type de montant",
  montantFixe: "Montant fixe",
  taux: "Taux (%)",
  rubriqueSource: "Rubrique source",
  valeurUnitaire: "Valeur unitaire",
  soumisCotisation: "Soumis à cotisation",
  soumisIR: "Soumis à l’IR",
  debut: "Date de début",
  fin: "Date de fin",
};

// options du select “Type de montant”
const typeOptions = ["Nombre", "Montant", "Pourcentage"];
// options pour rubriqueSource — à adapter selon votre domaine
const rubriqueOptions = ["Salaire de base", "Primes précédentes"];

export default function ParamPrimePage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();

  // états
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // snackbar
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });
  const showSnack = (msg, sev = "success") =>
    setSnack({ open: true, msg, sev });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // dialogs
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

  // chargement
  const fetchData = useCallback(async () => {
    const list = await getAll(tabKey);
    setData(list);
  }, []);

  useEffect(() => {
    fetchData();
    window.history.replaceState({}, "");
  }, [fetchData]);

  // filtrage
  const filtered = data.filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  // create callback
  const onCreated = useCallback(() => {
    fetchData();
    showSnack("Prime créée");
  }, [fetchData]);

  // update callback
  const onUpdated = useCallback(() => {
    fetchData();
    showSnack("Prime modifiée");
  }, [fetchData]);

  // delete confirm
  const confirmDelete = async () => {
    await deleteOne(tabKey, deleteId);
    setDeleteOpen(false);
    fetchData();
    showSnack("Prime supprimée", "info");
  };

  // split period
  const handleSplitClick = async (id) => {
    const rec = await getOne(tabKey, id);
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
    await updateOne(tabKey, splitForm.id, { fin: splitDate });
    const next = new Date(splitDate);
    next.setDate(next.getDate() + 1);
    const yyyy = next.getFullYear(),
      mm = String(next.getMonth() + 1).padStart(2, "0"),
      dd = String(next.getDate()).padStart(2, "0");
    setNewDebut(`${yyyy}-${mm}-${dd}`);
    setOrigFin(splitForm.fin);
    // prépare remainForm sans dates
    const keys = fieldKeys.filter((k) => k !== "debut" && k !== "fin");
    const init = {};
    keys.forEach((k) => (init[k] = splitForm[k]));
    setRemainForm(init);
    setSplitOpen(false);
    setRemainOpen(true);
    showSnack("Période découpée");
  };
  const confirmRemain = async () => {
    await createOne(tabKey, {
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
            Paramétrage des Primes & Indemnités
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
                    {columns.map((c) => (
                      <TableCell key={c}>{c}</TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id}>
                      {fieldKeys.map((f) => (
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
        entity={tabKey}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />
      <EditEntityDialog
        open={editOpen}
        entity={tabKey}
        id={editId}
        onClose={() => setEditOpen(false)}
        onUpdated={onUpdated}
      />

      {/* Delete */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>Voulez-vous supprimer cette prime ?</DialogContent>
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
              "nom",
              "code",
              "typeMontant",
              "montantFixe",
              "taux",
              "rubriqueSource",
              "valeurUnitaire",
              "soumisCotisation",
              "soumisIR",
            ].map((key) => {
              // switch on field type
              if (key === "typeMontant") {
                return (
                  <FormControl fullWidth key={key}>
                    <InputLabel>{labelMap[key]}</InputLabel>
                    <Select
                      name={key}
                      value={remainForm[key] || ""}
                      label={labelMap[key]}
                      onChange={(e) =>
                        setRemainForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                    >
                      {typeOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }
              if (["soumisCotisation", "soumisIR"].includes(key)) {
                return (
                  <FormControlLabel
                    key={key}
                    control={
                      <Switch
                        name={key}
                        checked={!!remainForm[key]}
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
                );
              }
              // default numeric/text
              return (
                <TextField
                  key={key}
                  fullWidth
                  type={
                    ["montantFixe", "taux", "valeurUnitaire"].includes(key)
                      ? "number"
                      : "text"
                  }
                  label={labelMap[key]}
                  name={key}
                  InputLabelProps={
                    ["montantFixe", "taux", "valeurUnitaire"].includes(key)
                      ? undefined
                      : key === "rubriqueSource"
                      ? undefined
                      : key === "nom" || key === "code"
                      ? undefined
                      : undefined
                  }
                  select={key === "rubriqueSource"}
                  value={remainForm[key] || ""}
                  onChange={(e) =>
                    setRemainForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                >
                  {key === "rubriqueSource" &&
                    rubriqueOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                </TextField>
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemainOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={confirmRemain}>
            Enregistrer
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
        <Alert onClose={closeSnack} severity={snack.sev} sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
