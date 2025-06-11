import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Toolbar,
  Autocomplete,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import {
  getAll,
  createOne,
  updateOne,
  deleteOne,
} from "../api/fakeElementsVariablesPaieApi.js";
import RhSidebar from "../components/RhSidebar.jsx";

const drawerWidth = 240;
const absenceTypes = [
  "CP",
  "Absence payée",
  "Absence non payée",
  "Grève",
  "Maladie",
  "Accident de travail",
  "Accident de trajet",
  "Maladie pro",
];
const payRubriques = [
  { code: "PREX", label: "Prime exceptionnelle" },
  { code: "PAID", label: "Prime de l’Aid" },
  { code: "PRDG", label: "Prime de rendement" },
  { code: "PRFY", label: "Prime de fin d’année" },
  { code: "INDP", label: "Indemnité de panier" },
  { code: "INDT", label: "Indemnité de transport" },
  { code: "INDD", label: "Indemnité de déplacement" },
  { code: "INDR", label: "Indemnité de représentation" },
  { code: "INDF", label: "Indemnité de fonction" },
  { code: "INDL", label: "Indemnité de licenciement" },
  { code: "CARF", label: "AN voiture de fonction" },
  { code: "HOUS", label: "AN logement" },
  { code: "TELI", label: "AN téléphone et internet" },
];

export default function ElementsVariablesPaiePage() {
  const { user } = useAuth();

  const [tab, setTab] = useState(0);
  const [employees, setEmployees] = useState([]);

  // Absence state
  const [formAbsence, setFormAbsence] = useState({
    matricule: "",
    typeAbsence: "",
    dateDebut: "",
    dateFin: "",
  });
  const [absenceHistory, setAbsenceHistory] = useState([]);

  // Rubriques state
  const [formRub, setFormRub] = useState({
    matricule: "",
    rubrique: "",
    designation: "",
    nombre: "",
    montant: "",
    dateDebut: "",
    dateFin: "",
  });
  const [rubriqueHistory, setRubriqueHistory] = useState([]);

  // Load employees for autocomplete
  useEffect(() => {
    axios
      .get("/api/salaries")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.content || [];
        setEmployees(
          list.map((s) => ({
            label: `${s.nom} ${s.prenom}`,
            matricule: s.matricule,
          }))
        );
      })
      .catch(console.error);
  }, []);

  const handleTabChange = (e, newVal) => setTab(newVal);

  // Absence handlers
  const onEmpSelectAbs = (_, value) => {
    const mat = value?.matricule || "";
    setFormAbsence((f) => ({ ...f, matricule: mat }));
    if (mat) {
      getAll("absences").then((all) =>
        setAbsenceHistory(all.filter((r) => r.matricule === mat))
      );
    } else {
      setAbsenceHistory([]);
    }
  };
  const handleFormAbsChange = (e) =>
    setFormAbsence((f) => ({ ...f, [e.target.name]: e.target.value }));
  const addAbsence = () => {
    createOne("absences", formAbsence).then(() =>
      getAll("absences").then((all) =>
        setAbsenceHistory(
          all.filter((r) => r.matricule === formAbsence.matricule)
        )
      )
    );
  };

  // Rubriques handlers
  const onEmpSelectRub = (_, value) => {
    const mat = value?.matricule || "";
    setFormRub((r) => ({ ...r, matricule: mat }));
    if (mat) {
      getAll("indemnites").then((all) =>
        setRubriqueHistory(all.filter((r) => r.matricule === mat))
      );
    } else {
      setRubriqueHistory([]);
    }
  };
  const handleFormRubChange = (e) => {
    const { name, value } = e.target;
    if (name === "rubrique") {
      const sel = payRubriques.find((r) => r.code === value);
      setFormRub((r) => ({
        ...r,
        rubrique: value,
        designation: sel ? sel.label : "",
      }));
    } else {
      setFormRub((r) => ({ ...r, [name]: value }));
    }
  };
  const addRubrique = () => {
    createOne("indemnites", formRub).then(() =>
      getAll("indemnites").then((all) =>
        setRubriqueHistory(all.filter((r) => r.matricule === formRub.matricule))
      )
    );
  };

  // Simulation handler
  const handleSimulate = () => console.log("Simuler la paie");

  return (
    <Box sx={{ display: "flex" }}>
      <RhSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          p: 3,
        }}
      >
        <Toolbar />
        <Container>
          <Typography variant="h5" align="center" gutterBottom>
            Éléments Variables de Paie
          </Typography>
          <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
            <Tab label="Absence" />
            <Tab label="Indemnités/Primes & Retenues" />
          </Tabs>

          {tab === 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Autocomplete
                  options={employees}
                  getOptionLabel={(o) => o.label}
                  onChange={onEmpSelectAbs}
                  sx={{ flex: "1 1 200px", minWidth: 200 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Rechercher Salarié" />
                  )}
                />
                <FormControl sx={{ flex: "1 1 150px", minWidth: 150 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="typeAbsence"
                    value={formAbsence.typeAbsence}
                    onChange={handleFormAbsChange}
                  >
                    {absenceTypes.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mb: 1,
                }}
              >
                <TextField
                  label="Date début"
                  name="dateDebut"
                  type="date"
                  value={formAbsence.dateDebut}
                  onChange={handleFormAbsChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Date fin"
                  name="dateFin"
                  type="date"
                  value={formAbsence.dateFin}
                  onChange={handleFormAbsChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Button variant="contained" onClick={addAbsence}>
                  Ajouter
                </Button>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Historique des Absences
                </Typography>
                <Button variant="contained" onClick={handleSimulate}>
                  Simulation de paie
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Matricule</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Date début</TableCell>
                      <TableCell>Date fin</TableCell>
                      <TableCell>Éditeur</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {absenceHistory.map((rec) => (
                      <TableRow key={rec.id}>
                        <TableCell>{rec.matricule}</TableCell>
                        <TableCell>{rec.typeAbsence}</TableCell>
                        <TableCell>
                          {new Date(rec.dateDebut).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(rec.dateFin).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{`${user.nom} ${user.prenom}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tab === 1 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Autocomplete
                  options={employees}
                  getOptionLabel={(o) => o.label}
                  onChange={onEmpSelectRub}
                  sx={{ flex: "1 1 200px", minWidth: 200 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Rechercher Salarié" />
                  )}
                />
                <FormControl sx={{ flex: "1 1 150px", minWidth: 150 }}>
                  <InputLabel>Rubrique</InputLabel>
                  <Select
                    name="rubrique"
                    value={formRub.rubrique}
                    onChange={handleFormRubChange}
                  >
                    {payRubriques.map((r) => (
                      <MenuItem
                        key={r.code}
                        value={r.code}
                      >{`${r.code} - ${r.label}`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Désignation"
                  name="designation"
                  value={formRub.designation}
                  disabled
                  sx={{
                    flex: "1 1 200px",
                    minWidth: 200,
                    backgroundColor: (theme) => theme.palette.grey[50],
                  }}
                />
                <TextField
                  label="Nombre"
                  name="nombre"
                  type="number"
                  value={formRub.nombre}
                  onChange={handleFormRubChange}
                  sx={{ flex: "1 1 100px", minWidth: 100 }}
                />
                <TextField
                  label="Montant"
                  name="montant"
                  type="number"
                  value={formRub.montant}
                  onChange={handleFormRubChange}
                  sx={{ flex: "1 1 100px", minWidth: 100 }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mb: 1,
                }}
              >
                <TextField
                  label="Date début"
                  name="dateDebut"
                  type="date"
                  value={formRub.dateDebut}
                  onChange={handleFormRubChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Date fin"
                  name="dateFin"
                  type="date"
                  value={formRub.dateFin}
                  onChange={handleFormRubChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Button variant="contained" onClick={addRubrique}>
                  Ajouter
                </Button>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Historique des Indemnités/Primes & Retenues
                </Typography>
                <Button variant="contained" onClick={handleSimulate}>
                  Simulation de paie
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Matricule</TableCell>
                      <TableCell>Rubrique</TableCell>
                      <TableCell>Désignation</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Montant</TableCell>
                      <TableCell>Date début</TableCell>
                      <TableCell>Date fin</TableCell>
                      <TableCell>Éditeur</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rubriqueHistory.map((rec) => (
                      <TableRow key={rec.id}>
                        <TableCell>{rec.matricule}</TableCell>
                        <TableCell>{rec.rubrique}</TableCell>
                        <TableCell>{rec.designation}</TableCell>
                        <TableCell>{rec.nombre}</TableCell>
                        <TableCell>{rec.montant}</TableCell>
                        <TableCell>
                          {new Date(rec.dateDebut).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(rec.dateFin).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{`${user.nom} ${user.prenom}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}
