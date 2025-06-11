import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Link,
  Toolbar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import RhSidebar from "../components/RhSidebar.jsx";

export default function CalculPaiePage() {
  const [matricule, setMatricule] = useState("");
  const [societes, setSocietes] = useState([]);
  const [selectedSociete, setSelectedSociete] = useState("");
  const [departements, setDepartements] = useState([]);
  const [selectedDepartement, setSelectedDepartement] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statuts, setStatuts] = useState([]);
  const [selectedStatut, setSelectedStatut] = useState("");
  const [typesContrat, setTypesContrat] = useState([]);
  const [selectedTypeContrat, setSelectedTypeContrat] = useState("");
  const [periode, setPeriode] = useState("");

  useEffect(() => {
    // Remplacer par vos appels API si besoin
    setSocietes(["Société A", "Société B"]);
    setDepartements(["Département 1", "Département 2"]);
    setServices(["Service X", "Service Y"]);
    setCategories(["Cadre", "Non-cadre"]);
    setStatuts(["Actif", "Inactif"]);
    setTypesContrat(["CDI", "CDD"]);
  }, []);

  const handleCalculate = () => {
    // Lancer le calcul de paie
    console.log({
      matricule,
      selectedSociete,
      selectedDepartement,
      selectedService,
      selectedCategory,
      selectedStatut,
      selectedTypeContrat,
      periode,
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <RhSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="md">
          <Typography variant="h5" align="center" gutterBottom>
            Calcul de la paie
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              label="Matricule"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Société</InputLabel>
              <Select
                value={selectedSociete}
                label="Société"
                onChange={(e) => setSelectedSociete(e.target.value)}
              >
                {societes.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Département</InputLabel>
              <Select
                value={selectedDepartement}
                label="Département"
                onChange={(e) => setSelectedDepartement(e.target.value)}
              >
                {departements.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Service</InputLabel>
              <Select
                value={selectedService}
                label="Service"
                onChange={(e) => setSelectedService(e.target.value)}
              >
                {services.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Catégorie de salarié</InputLabel>
              <Select
                value={selectedCategory}
                label="Catégorie de salarié"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Statut de salarié</InputLabel>
              <Select
                value={selectedStatut}
                label="Statut de salarié"
                onChange={(e) => setSelectedStatut(e.target.value)}
              >
                {statuts.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Type de contrat</InputLabel>
              <Select
                value={selectedTypeContrat}
                label="Type de contrat"
                onChange={(e) => setSelectedTypeContrat(e.target.value)}
              >
                {typesContrat.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Période"
              type="month"
              InputLabelProps={{ shrink: true }}
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Button variant="contained" onClick={handleCalculate}>
              Calculer
            </Button>
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 2 }}
          >
            <Link
              component={RouterLink}
              to="/bulletins"
              underline="hover"
              sx={{ fontWeight: "medium", color: "primary.main" }}
            >
              Afficher bulletins de salaires
            </Link>
            <Link
              component={RouterLink}
              to="/journal-erreurs"
              underline="hover"
              sx={{ fontWeight: "medium", color: "primary.main" }}
            >
              Accéder au journal des erreurs
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
