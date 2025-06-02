// src/pages/ParamTempsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Switch,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import ConfigurateurSidebar from "../components/ConfigurateurSidebar";
import CreateEntityDialog from "../components/CreateEntityDialog";
import EditEntityDialog from "../components/EditEntityDialog";
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "../api/fakeTempsApi";

function formatDateFR(d) {
  return d ? new Date(d).toLocaleDateString("fr-FR") : "";
}

const drawerWidth = 240;
const tabConfig = [
  { key: "holidays", label: "Calendrier des jours fériés" },
  { key: "absenceTypes", label: "Types d’absences pour demande de congés" },
];

const columns = {
  holidays: [
    "Nom du jour férié",
    "Date du jour férié",
    "Date début validité",
    "Date fin validité",
  ],
  absenceTypes: [
    "Nom de l’absence",
    "Code interne",
    "Décompte dans le solde",
    "Justificatif requis",
    "Date début",
    "Date fin",
  ],
};

const fieldKeys = {
  holidays: ["nom", "dateExacte", "debut", "fin"],
  absenceTypes: ["nom", "code", "decompte", "justificatif", "debut", "fin"],
};

export default function ParamTempsPage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [activeTab, setActiveTab] = useState("holidays");
  const [data, setData] = useState({ holidays: [], absenceTypes: [] });
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });

  const showSnack = (msg, sev = "success") =>
    setSnack({ open: true, msg, sev });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const fetchData = useCallback(async () => {
    const h = await getAll("holidays");
    const a = await getAll("absenceTypes");
    setData({ holidays: h, absenceTypes: a });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // liste des années basées sur les intervalles [debut, fin]
  const holidayYears = useMemo(() => {
    const years = new Set();
    data.holidays.forEach((h) => {
      if (!h.debut || !h.fin) return;
      const y0 = new Date(h.debut).getFullYear();
      const y1 = new Date(h.fin).getFullYear();
      for (let y = y0; y <= y1; y++) {
        years.add(y);
      }
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [data.holidays]);

  // filtrage global + année
  const filtered = useMemo(() => {
    let list = data[activeTab];
    // recherche texte
    list = list.filter((row) =>
      Object.values(row).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    );
    // si onglet holidays et filtre année actif
    if (activeTab === "holidays" && yearFilter) {
      list = list.filter((h) => {
        const y0 = new Date(h.debut).getFullYear();
        const y1 = new Date(h.fin).getFullYear();
        const yf = parseInt(yearFilter, 10);
        return yf >= y0 && yf <= y1;
      });
    }
    return list;
  }, [data, activeTab, search, yearFilter]);

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
    const iso = next.toISOString().slice(0, 10);
    const copy = { ...splitForm, debut: iso, fin: splitForm.fin };
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
            Paramétrage des données des temps
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
                setYearFilter("");
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
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateOpen(true)}
              >
                Créer
              </Button>
            </Box>
          </Box>

          {/* Filtre par année, juste pour 'holidays' */}
          {activeTab === "holidays" && (
            <Box
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography>
                Voir liste des jours fériés pour l'année :
              </Typography>
              <FormControl size="small">
                <Select
                  displayEmpty
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  sx={{ minWidth: 140 }}
                  renderValue={(v) => (v ? v : "Toutes les années")}
                >
                  <MenuItem value="">
                    <em>Toutes les années</em>
                  </MenuItem>
                  {holidayYears.map((y) => (
                    <MenuItem key={y} value={y.toString()}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Tableau */}
          <Paper>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns[activeTab].map((c) => (
                      <TableCell key={c}>{c}</TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id}>
                      {fieldKeys[activeTab].map((k) => (
                        <TableCell key={k}>
                          {k === "dateExacte"
                            ? row.dateExacte
                              ? (() => {
                                  const d = new Date(row.dateExacte);
                                  const mm = String(d.getMonth() + 1).padStart(
                                    2,
                                    "0"
                                  );
                                  const dd = String(d.getDate()).padStart(
                                    2,
                                    "0"
                                  );
                                  return `${dd}/${mm}`;
                                })()
                              : ""
                            : k === "debut" || k === "fin"
                            ? formatDateFR(row[k])
                            : typeof row[k] === "boolean"
                            ? row[k]
                              ? "Oui"
                              : "Non"
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
