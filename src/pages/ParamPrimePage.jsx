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
} from "../api/paramPrimeIndemniteApi.js";

// formateur JJ/MM/AAAA
function formatDateFR(date) {
  return date ? new Date(date).toLocaleDateString("fr-FR") : "";
}

const drawerWidth = 240;
const tabKey = "typePrime"; // résout vers /api/types-prime

// colonnes du tableau
const columns = [
  "Code",
  "Type",
  "Unité",
  "Nombre",
  "Montant fixe",
  "Taux (%)",
  "CNSS",
  "AMO",
  "CIMR",
  "IR",
  "Date début",
  "Date fin",
  "Actions",
];

// clés des champs (dans l'ordre des colonnes)
const fieldKeys = [
  "codeTypePrime",
  "type",
  "unite",
  "nombre",
  "montantFixe",
  "tauxPourcentage",
  "soumisCNSS",
  "soumisAMO",
  "soumisCIMR",
  "soumisIR",
  "dateDebut",
  "dateFin",
];

// étiquettes pour les formulaires
const labelMap = {
  codeTypePrime: "Code",
  type: "Type",
  unite: "Unité",
  nombre: "Nombre",
  montantFixe: "Montant fixe",
  tauxPourcentage: "Taux (%)",
  soumisCNSS: "Soumis CNSS",
  soumisAMO: "Soumis AMO",
  soumisCIMR: "Soumis CIMR",
  soumisIR: "Soumis IR",
  dateDebut: "Date début",
  dateFin: "Date fin",
};

// options pour les selects
const uniteOptions = ["Montant fixe", "Pourcentage", "Nombre"];
export default function ParamPrimePage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // états
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });

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

  const showSnack = (msg, sev = "success") =>
    setSnack({ open: true, msg, sev });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // chargement des données
  const fetchData = useCallback(async () => {
    const list = await getAll(tabKey);
    setData(list);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // filtrage
  const filtered = data.filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  // callbacks CRUD
  const onCreated = useCallback(() => {
    fetchData();
    showSnack("Type prime créé");
  }, [fetchData]);

  const onUpdated = useCallback(() => {
    fetchData();
    showSnack("Type prime modifié");
  }, [fetchData]);

  const confirmDelete = async () => {
    await deleteOne(tabKey, deleteId);
    setDeleteOpen(false);
    fetchData();
    showSnack("Type prime supprimé", "info");
  };

  // split period
  const handleSplit = async (id) => {
    const rec = await getOne(tabKey, id);
    setSplitForm(rec);
    setSplitDate(rec.dateFin);
    setSplitOpen(true);
  };
  const confirmSplit = async () => {
    if (!splitForm) return;
    const d0 = new Date(splitForm.dateDebut),
      d1 = new Date(splitForm.dateFin),
      ds = new Date(splitDate);
    if (ds <= d0 || ds >= d1) return alert("Date hors période !");
    // on ferme et on prépare la seconde partie
    await updateOne(tabKey, splitForm.idTypePrime, { dateFin: splitDate });
    const next = new Date(splitDate);
    next.setDate(next.getDate() + 1);
    setNewDebut(next.toISOString().slice(0, 10));
    setOrigFin(splitForm.dateFin);
    const keys = fieldKeys.filter((k) => k !== "dateDebut" && k !== "dateFin");
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
            Paramétrage des Types de Prime & Indemnité
          </Typography>

          {/* barre d'actions */}
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

          {/* tableau */}
          <Paper>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((c) => (
                      <TableCell key={c}>{c}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.idTypePrime}>
                      {fieldKeys.map((f) => (
                        <TableCell key={f}>
                          {["dateDebut", "dateFin"].includes(f)
                            ? formatDateFR(row[f])
                            : typeof row[f] === "boolean"
                            ? row[f] === true
                              ? "Oui"
                              : "Non"
                            : row[f] ?? "Non"}
                        </TableCell>
                      ))}
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleSplit(row.idTypePrime)}
                        >
                          <EditCalendarIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditId(row.idTypePrime);
                            setEditOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setDeleteId(row.idTypePrime);
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

      {/* Create / Edit dialogs */}
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

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>Voulez-vous supprimer ce type de prime ?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Annuler</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Split period dialog */}
      <Dialog
        open={splitOpen}
        onClose={() => setSplitOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Délimiter la période</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Choisissez la nouvelle date de fin de la période
          </Typography>
          <TextField
            fullWidth
            label="Date fin"
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

      {/* Remain period dialog */}
      <Dialog
        open={remainOpen}
        onClose={() => setRemainOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Modifier la nouvelle période</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {fieldKeys
              .filter((k) => k !== "dateDebut" && k !== "dateFin")
              .map((key) => {
                // boolean switches
                if (
                  [
                    "soumisCNSS",
                    "soumisAMO",
                    "soumisCIMR",
                    "soumisIR",
                  ].includes(key)
                ) {
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
                // select unité
                if (key === "unite") {
                  return (
                    <FormControl fullWidth key={key}>
                      <InputLabel>{labelMap[key]}</InputLabel>
                      <Select
                        name={key}
                        value={remainForm[key] || ""}
                        label={labelMap[key]}
                        onChange={(e) =>
                          setRemainForm((f) => ({
                            ...f,
                            [key]: e.target.value,
                          }))
                        }
                      >
                        {uniteOptions.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }
                // number/text fields
                return (
                  <TextField
                    key={key}
                    fullWidth
                    type={
                      ["nombre", "montantFixe", "tauxPourcentage"].includes(key)
                        ? "number"
                        : "text"
                    }
                    label={labelMap[key]}
                    name={key}
                    value={remainForm[key] || ""}
                    onChange={(e) =>
                      setRemainForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                  />
                );
              })}
            {/* dates en lecture seule */}
            <TextField
              fullWidth
              label="Date début"
              type="date"
              value={newDebut}
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              fullWidth
              label="Date fin originale"
              type="date"
              value={origFin}
              InputLabelProps={{ shrink: true }}
              disabled
            />
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
