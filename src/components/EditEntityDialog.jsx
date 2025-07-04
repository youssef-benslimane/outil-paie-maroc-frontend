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
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";
import {
  getOne as getParam,
  updateOne as updateParam,
} from "../api/paramAdminApi.js";
import {
  getOne as getCot,
  updateOne as updateCot,
} from "../api/paramCotisationsApi.js";
import {
  getOne as getAbs,
  updateOne as updateAbs,
} from "../api/fakeAbsenceApi.js";
import {
  getOne as getPrime,
  updateOne as updatePrime,
} from "../api/fakePrimeApi.js";
import {
  getBaremeIRById as getBaremeIR,
  updateBaremeIR as updateBaremeIR,
} from "../api/paramBaremeIRApi.js";
import {
  getOne as getTemps,
  updateOne as updateTemps,
} from "../api/fakeTempsApi.js";
import {
  getOne as getMotifMesure,
  updateOne as updateMotifMesure,
} from "../api/fakeMotifMesureApi.js";
import {
  getAll as getAllProfils,
  getOne as getProfil,
  updateOne as updateProfil,
  getOne as getGrille,
  updateOne as updateGrille,
} from "../api/fakeProfilGrilleApi.js";

import {
  getOne as getTypePrime,
  updateOne as updateTypePrime,
} from "../api/paramPrimeIndemniteApi.js";
import { fieldDefinitions } from "./CreateEntityDialog.jsx";

export default function EditEntityDialog({
  open,
  entity,
  id,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState({});
  const [mesureOptions, setMesureOptions] = useState([]);
  const [profilOptions, setProfilOptions] = useState([]);

  useEffect(() => {
    if (!open || id == null) return;
    if (entity === "motifs") {
      (async () => {
        const list = await getAllMesures("mesures");
        setMesureOptions(
          list.map((m) => ({ value: m.code, label: `${m.code} – ${m.nom}` }))
        );
      })();
    }
    if (entity === "grilles") {
      (async () => {
        const list = await getAllProfils("profils");
        setProfilOptions(list.map((p) => ({ value: p.nom, label: p.nom })));
      })();
    }
    let fetchFn;
    switch (entity) {
      case "typePrime":
        fetchFn = getTypePrime;
        break;
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
        fetchFn = getBaremeIR;
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
    fetchFn(id).then((data) => setForm({ ...data }));
  }, [open, entity, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async () => {
    let updateFn;
    switch (entity) {
      case "typePrime":
        updateFn = updateTypePrime;
        break;
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
        updateFn = updateBaremeIR;
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

    const payload = { ...form };
    if (entity === "typeCot") {
      delete payload.cotisations;
      delete payload.idTypeCotisation;
    }
    const targetId = id ?? form.idTypePrime ?? form.idTypeCotisation;

    await updateFn(targetId, payload);

    onUpdated();
    onClose();
  };

  const titles = {
    societe: "Modifier une Société",
    contrat: "Modifier un Type de contrat",
    categorie: "Modifier une Catégorie",
    statut: "Modifier un Statut",
    unite: "Modifier une Unité",
    typeCot: "Modifier un Type de cotisation",
    cotisation: "Modifier une Cotisation",
    typeAbsence: "Modifier un Type d’absence",
    typePrime: "Modifier un Type de Prime / Indemnité",
    prime: "Modifier une Prime / Indemnité",
    tranches: "Modifier une Tranche IR",
    plafonds: "Modifier une Constante / Plafond IR",
    holidays: "Modifier un Jour férié",
    absenceTypes: "Modifier un Type d’absence",
    mesures: "Modifier une Mesure disciplinaire",
    motifs: "Modifier un Motif de mesure",
    profils: "Modifier un Profil",
    grilles: "Modifier une Grille salariale",
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{titles[entity]}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {fieldDefinitions[entity].map((f) => {
            if (
              (entity === "motifs" && f.key === "mesureCode") ||
              (entity === "grilles" && f.key === "profil")
            ) {
              const opts = entity === "motifs" ? mesureOptions : profilOptions;
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
                    {opts.map((opt) => (
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
                    {f.options.map((opt) => (
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
                InputLabelProps={f.type === "date" ? { shrink: true } : {}}
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
