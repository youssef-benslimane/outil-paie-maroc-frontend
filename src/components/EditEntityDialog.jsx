// src/components/EditEntityDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
// APIs existantes
import {
  getOne as getParam,
  updateOne as updateParam,
} from "../api/fakeParamAdminApi.js";
import {
  getOne as getCot,
  updateOne as updateCot,
} from "../api/fakeCotisationsApi.js";
import {
  getOne as getAbs,
  updateOne as updateAbs,
} from "../api/fakeAbsenceApi.js";
import {
  getOne as getPrime,
  updateOne as updatePrime,
} from "../api/fakePrimeApi.js";
import {
  getOne as getBareme,
  updateOne as updateBareme,
} from "../api/fakeBaremeApi.js";
import {
  getOne as getTemps,
  updateOne as updateTemps,
} from "../api/fakeTempsApi.js";
import {
  getOne as getMotifMesure,
  updateOne as updateMotifMesure,
} from "../api/fakeMotifMesureApi.js";
// Nouvelle API Profils & Grilles
import {
  getAll as getAllProfils,
  getOne as getProfil,
  updateOne as updateProfil,
  getOne as getGrille,
  updateOne as updateGrille,
} from "../api/fakeProfilGrilleApi.js";
import { fieldDefinitions } from "./CreateEntityDialog.jsx";

export default function EditEntityDialog({
  open,
  entity,
  id,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState({});
  const [profilOptions, setProfilOptions] = useState([]);

  useEffect(() => {
    if (!open || id == null) return;

    // Si on modifie une "grille", charger les profils pour le select
    if (entity === "grilles") {
      (async () => {
        const profils = await getAllProfils("profils");
        // On stocke un tableau d'options { value: nom, label: nom }
        setProfilOptions(profils.map((p) => ({ value: p.nom, label: p.nom })));
      })();
    }

    let fetchFn;
    switch (entity) {
      case "typeCot":
      case "cotisation":
        fetchFn = getCot;
        break;
      case "typeAbsence":
        fetchFn = getAbs;
        break;
      case "prime":
        fetchFn = getPrime;
        break;
      case "tranches":
      case "plafonds":
        fetchFn = getBareme;
        break;
      case "holidays":
      case "absenceTypes":
        fetchFn = getTemps;
        break;
      case "mesures":
      case "motifs":
        fetchFn = getMotifMesure;
        break;
      case "profils":
        fetchFn = getProfil;
        break;
      case "grilles":
        fetchFn = getGrille;
        break;
      default:
        fetchFn = getParam;
    }

    fetchFn(entity, id).then((data) => setForm(data || {}));
  }, [open, entity, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async () => {
    let updateFn;
    switch (entity) {
      case "typeCot":
      case "cotisation":
        updateFn = updateCot;
        break;
      case "typeAbsence":
        updateFn = updateAbs;
        break;
      case "prime":
        updateFn = updatePrime;
        break;
      case "tranches":
      case "plafonds":
        updateFn = updateBareme;
        break;
      case "holidays":
      case "absenceTypes":
        updateFn = updateTemps;
        break;
      case "mesures":
      case "motifs":
        updateFn = updateMotifMesure;
        break;
      case "profils":
        updateFn = updateProfil;
        break;
      case "grilles":
        updateFn = updateGrille;
        break;
      default:
        updateFn = updateParam;
    }
    await updateFn(entity, id, form);
    onUpdated();
    onClose();
  };

  const fields = fieldDefinitions[entity] || [];
  const titles = {
    societe: "Modifier une Société",
    contrat: "Modifier un Type de contrat",
    categorie: "Modifier une Catégorie",
    statut: "Modifier un Statut",
    unite: "Modifier une Unité",
    typeCot: "Modifier un Type de cotisation",
    cotisation: "Modifier une Cotisation",
    typeAbsence: "Modifier un Type d’absence",
    prime: "Modifier une Prime / Indemnité",
    tranches: "Modifier une Tranche IR",
    plafonds: "Modifier une Constante / Plafond IR",
    holidays: "Modifier un Jour férié",
    absenceTypes: "Modifier un Type d’absence pour congés",
    mesures: "Modifier une Mesure disciplinaire",
    motifs: "Modifier un Motif de mesure",
    profils: "Modifier un Profil",
    grilles: "Modifier une Grille",
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{titles[entity] || `Modifier ${entity}`}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {fields.map((f) => {
            // Si on modifie une grille et que c'est le champ "profil", on affiche la liste dynamique
            if (entity === "grilles" && f.key === "profil") {
              return (
                <FormControl fullWidth key={f.key}>
                  <InputLabel id={`${f.key}-label`}>{f.label}</InputLabel>
                  <Select
                    labelId={`${f.key}-label`}
                    name={f.key}
                    value={form[f.key] ?? ""}
                    label={f.label}
                    onChange={handleChange}
                  >
                    {profilOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }

            if (f.type === "select") {
              return (
                <FormControl fullWidth key={f.key}>
                  <InputLabel id={`${f.key}-label`}>{f.label}</InputLabel>
                  <Select
                    labelId={`${f.key}-label`}
                    name={f.key}
                    value={form[f.key] ?? ""}
                    label={f.label}
                    onChange={handleChange}
                  >
                    {f.options?.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }

            if (f.type === "toggle") {
              return (
                <FormControlLabel
                  key={f.key}
                  control={
                    <Switch
                      name={f.key}
                      checked={!!form[f.key]}
                      onChange={handleChange}
                    />
                  }
                  label={f.label}
                />
              );
            }

            return (
              <TextField
                key={f.key}
                fullWidth
                type={f.type === "text-multiline" ? "text" : f.type}
                label={f.label}
                name={f.key}
                multiline={f.type === "text-multiline"}
                rows={f.type === "text-multiline" ? 3 : undefined}
                InputLabelProps={
                  f.type === "date" ? { shrink: true } : undefined
                }
                value={form[f.key] ?? ""}
                onChange={handleChange}
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
}
