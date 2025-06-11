import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RhSidebar from "../components/RhSidebar.jsx";

const drawerWidth = 240;

export default function RechercheSalariePage() {
  const [filters, setFilters] = useState({
    categorie: "",
    statut: "",
    contrat: "",
    nom: "",
    prenom: "",
    dateEmbauche: "",
  });
  const [salaries, setSalaries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get("/api/salaries", { params: filters });
      const data = response.data;
      const list = Array.isArray(data)
        ? data
        : data.content || data.salaries || [];
      setSalaries(list);
    } catch (error) {
      console.error("Erreur lors du chargement des salariés", error);
      setSalaries([]);
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    fetchSalaries();
  };

  const handleViewFiche = (id) => {
    navigate(`/salaries/${id}`);
  };

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
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Typography variant="h5">Recherche d'un Salarié</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "flex-start",
              mt: 2,
              mb: 2,
            }}
          >
            <FormControl sx={{ flex: "1 1 150px", minWidth: 150 }}>
              <InputLabel id="categorie-label">Catégorie</InputLabel>
              <Select
                labelId="categorie-label"
                name="categorie"
                value={filters.categorie}
                label="Catégorie"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Tous</em>
                </MenuItem>
                <MenuItem value="Ouvrier">Ouvrier</MenuItem>
                <MenuItem value="Cadre">Cadre</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ flex: "1 1 150px", minWidth: 150 }}>
              <InputLabel id="statut-label">Statut</InputLabel>
              <Select
                labelId="statut-label"
                name="statut"
                value={filters.statut}
                label="Statut"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Tous</em>
                </MenuItem>
                <MenuItem value="Actif">Actif</MenuItem>
                <MenuItem value="Inactif">Inactif</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ flex: "1 1 150px", minWidth: 150 }}>
              <InputLabel id="contrat-label">Type de contrat</InputLabel>
              <Select
                labelId="contrat-label"
                name="contrat"
                value={filters.contrat}
                label="Type de contrat"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Tous</em>
                </MenuItem>
                <MenuItem value="CDI">CDI</MenuItem>
                <MenuItem value="CDD">CDD</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Nom"
              name="nom"
              value={filters.nom}
              onChange={handleChange}
              sx={{ flex: "1 1 150px", minWidth: 150 }}
            />

            <TextField
              label="Prénom"
              name="prenom"
              value={filters.prenom}
              onChange={handleChange}
              sx={{ flex: "1 1 150px", minWidth: 150 }}
            />

            <TextField
              label="Date d'embauche"
              type="date"
              name="dateEmbauche"
              value={filters.dateEmbauche}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: "1 1 150px", minWidth: 150 }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{ height: 40, px: 4 }}
            >
              Rechercher
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Matricule</TableCell>
                  <TableCell>Date d'embauche</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Type de contrat</TableCell>
                  <TableCell>Fiche salarié</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(salaries) && salaries.length > 0 ? (
                  salaries.map((sal) => (
                    <TableRow key={sal.id} hover>
                      <TableCell>{sal.matricule}</TableCell>
                      <TableCell>
                        {new Date(sal.dateEmbauche).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{sal.nom}</TableCell>
                      <TableCell>{sal.prenom}</TableCell>
                      <TableCell>{sal.categorie}</TableCell>
                      <TableCell>{sal.statut}</TableCell>
                      <TableCell>{sal.typeContrat}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewFiche(sal.id)}
                        >
                          Fiche
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Aucun salarié trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
}
