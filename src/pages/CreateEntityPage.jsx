// src/pages/CreateEntityPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SideBar from "../components/ConfigurateurSidebar.jsx";
import { createOne } from "../api/fakeParamAdminApi.js";

const drawerWidth = 240;

export default function CreateEntityPage() {
  const { entity } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await createOne(entity, form);
    navigate("/configurateur/param-admin", { state: { tab: entity } });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />

      <Box
        component="main"
        sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container
          sx={{
            mt: 5,
            mb: 5,
            ml: isMdUp ? `${drawerWidth}px` : 0,
            px: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 500 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Créer un(e) {entity}
            </Typography>

            <Stack spacing={2}>
              {/* Société */}
              {entity === "societe" &&
                [
                  { key: "nom", label: "Nom de la société" },
                  { key: "adresse", label: "Adresse" },
                  { key: "ville", label: "Ville" },
                  { key: "identFiscal", label: "Identifiant fiscal" },
                  { key: "cnss", label: "Numéro CNSS" },
                  { key: "ice", label: "Numéro ICE" },
                  { key: "rc", label: "Numéro RC" },
                ].map(({ key, label }) => (
                  <TextField
                    key={key}
                    fullWidth
                    label={label}
                    name={key}
                    onChange={handleChange}
                  />
                ))}

              {entity === "societe" && (
                <>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date début"
                    name="debut"
                    InputLabelProps={{ shrink: true }}
                    value={form.debut || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Date fin"
                    name="fin"
                    InputLabelProps={{ shrink: true }}
                    value={form.fin || ""}
                    onChange={handleChange}
                  />
                </>
              )}

              {/* Contrat */}
              {entity === "contrat" && (
                <>
                  <TextField
                    fullWidth
                    label="Code du contrat"
                    name="code"
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Nom du contrat"
                    name="nom"
                    onChange={handleChange}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="essai-label">Période d’essai</InputLabel>
                    <Select
                      labelId="essai-label"
                      name="essai"
                      value={form.essai || ""}
                      label="Période d’essai"
                      onChange={handleChange}
                    >
                      <MenuItem value="1 mois">1 mois</MenuItem>
                      <MenuItem value="2 mois">2 mois</MenuItem>
                      <MenuItem value="3 mois">3 mois</MenuItem>
                      <MenuItem value="6 mois">6 mois</MenuItem>
                      <MenuItem value="Aucune">Aucune</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date début"
                    name="debut"
                    InputLabelProps={{ shrink: true }}
                    value={form.debut || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Date fin"
                    name="fin"
                    InputLabelProps={{ shrink: true }}
                    value={form.fin || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Conditions spécifiques"
                    name="conditions"
                    onChange={handleChange}
                  />
                </>
              )}

              {/* Catégorie de salarié */}
              {entity === "categorie" && (
                <>
                  <TextField
                    fullWidth
                    label="Code de la catégorie"
                    name="code"
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Nom de la catégorie"
                    name="nom"
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description de la catégorie"
                    name="description"
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Date début"
                    name="debut"
                    InputLabelProps={{ shrink: true }}
                    value={form.debut || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Date fin"
                    name="fin"
                    InputLabelProps={{ shrink: true }}
                    value={form.fin || ""}
                    onChange={handleChange}
                  />
                </>
              )}

              {/* Statut de salarié */}
              {entity === "statut" && (
                <>
                  <TextField
                    fullWidth
                    label="Code du statut"
                    name="code"
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Nom du statut"
                    name="nom"
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description du statut"
                    name="description"
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Date début"
                    name="debut"
                    InputLabelProps={{ shrink: true }}
                    value={form.debut || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Date fin"
                    name="fin"
                    InputLabelProps={{ shrink: true }}
                    value={form.fin || ""}
                    onChange={handleChange}
                  />
                </>
              )}

              {/* Unité organisationnelle */}
              {entity === "unite" && (
                <>
                  <TextField
                    fullWidth
                    label="Code de l’unité"
                    name="code"
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Nom de l’unité"
                    name="nom"
                    onChange={handleChange}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="type-unite-label">Type d’unité</InputLabel>
                    <Select
                      labelId="type-unite-label"
                      name="type"
                      value={form.type || ""}
                      label="Type d’unité"
                      onChange={handleChange}
                    >
                      <MenuItem value="Département">Département</MenuItem>
                      <MenuItem value="Service">Service</MenuItem>
                      <MenuItem value="Direction">Direction</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="rattachement-label">
                      Rattachement hiérarchique
                    </InputLabel>
                    <Select
                      labelId="rattachement-label"
                      name="parent"
                      value={form.parent || ""}
                      label="Rattachement hiérarchique"
                      onChange={handleChange}
                    >
                      <MenuItem value="">Aucun</MenuItem>
                      <MenuItem value="1">Département RH</MenuItem>
                      <MenuItem value="2">Service IT</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description de l’unité"
                    name="description"
                    onChange={handleChange}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="statut-unite-label">
                      Statut de l’unité
                    </InputLabel>
                    <Select
                      labelId="statut-unite-label"
                      name="statut"
                      value={form.statut || ""}
                      label="Statut de l’unité"
                      onChange={handleChange}
                    >
                      <MenuItem value="Actif">Actif</MenuItem>
                      <MenuItem value="Inactif">Inactif</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date début"
                    name="debut"
                    InputLabelProps={{ shrink: true }}
                    value={form.debut || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Date fin"
                    name="fin"
                    InputLabelProps={{ shrink: true }}
                    value={form.fin || ""}
                    onChange={handleChange}
                  />
                </>
              )}
            </Stack>

            {/* Boutons d’action */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() =>
                  navigate("/configurateur/param-admin", {
                    state: { tab: entity },
                  })
                }
              >
                Annuler
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                Enregistrer
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
