// src/components/CreateEntityDialog.jsx
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
// API ParamAdmin
import { createOne as createParam } from "../api/fakeParamAdminApi.js";
// API Cotisations
import { createOne as createCot } from "../api/fakeCotisationsApi.js";

export const fieldDefinitions = {
  // --- ParamAdmin ---
  societe: [
    { key: "nom", label: "Nom de la société", type: "text" },
    { key: "adresse", label: "Adresse", type: "text" },
    { key: "ville", label: "Ville", type: "text" },
    { key: "identFiscal", label: "Identifiant fiscal", type: "text" },
    { key: "cnss", label: "Numéro CNSS", type: "text" },
    { key: "ice", label: "Numéro ICE", type: "text" },
    { key: "rc", label: "Numéro RC", type: "text" },
    { key: "debut", label: "Date début", type: "date" },
    { key: "fin", label: "Date fin", type: "date" },
  ],
  contrat: [
    { key: "code", label: "Code du contrat", type: "text" },
    { key: "nom", label: "Nom du contrat", type: "text" },
    {
      key: "essai",
      label: "Période d’essai",
      type: "select",
      options: ["1 mois", "2 mois", "3 mois", "6 mois", "Aucune"],
    },
    { key: "debut", label: "Date début", type: "date" },
    { key: "fin", label: "Date fin", type: "date" },
    { key: "conditions", label: "Conditions spécifiques", type: "text" },
  ],
  categorie: [
    { key: "code", label: "Code de la catégorie", type: "text" },
    { key: "nom", label: "Nom de la catégorie", type: "text" },
    { key: "description", label: "Description", type: "text-multiline" },
    { key: "debut", label: "Date début", type: "date" },
    { key: "fin", label: "Date fin", type: "date" },
  ],
  statut: [
    { key: "code", label: "Code du statut", type: "text" },
    { key: "nom", label: "Nom du statut", type: "text" },
    { key: "description", label: "Description", type: "text-multiline" },
    { key: "debut", label: "Date début", type: "date" },
    { key: "fin", label: "Date fin", type: "date" },
  ],
  unite: [
    { key: "code", label: "Code de l’unité", type: "text" },
    { key: "nom", label: "Nom de l’unité", type: "text" },
    {
      key: "type",
      label: "Type d’unité",
      type: "select",
      options: ["Département", "Service", "Direction"],
    },
    {
      key: "parent",
      label: "Rattachement hiérarchique",
      type: "select",
      options: ["Aucun", "Département RH", "Service IT"],
    },
    { key: "description", label: "Description", type: "text-multiline" },
    {
      key: "statut",
      label: "Statut de l’unité",
      type: "select",
      options: ["Actif", "Inactif"],
    },
    { key: "debut", label: "Date début", type: "date" },
    { key: "fin", label: "Date fin", type: "date" },
  ],

  // --- Paramétrage des cotisations ---
  typeCot: [
    { key: "nom", label: "Nom du type de cotisation", type: "text" },
    { key: "description", label: "Description", type: "text-multiline" },
    { key: "debut", label: "Date d’entrée en vigueur", type: "date" },
    { key: "fin", label: "Date de fin de validité", type: "date" },
  ],
  cotisation: [
    {
      key: "type",
      label: "Type de cotisation",
      type: "select",
      options: ["CNSS", "CIMR", "AMO"],
    },
    { key: "code", label: "Code de la cotisation", type: "text" },
    { key: "nom", label: "Nom de la cotisation", type: "text" },
    { key: "tauxSalarial", label: "Taux salarial (%)", type: "text" },
    { key: "tauxPatronal", label: "Taux patronal (%)", type: "text" },
    { key: "plafondSalarial", label: "Plafond salarial", type: "text" },
    { key: "plafondPatronal", label: "Plafond patronal", type: "text" },
    { key: "debut", label: "Date début", type: "date" },
    { key: "fin", label: "Date fin", type: "date" },
    {
      key: "description",
      label: "Informations complémentaires",
      type: "text-multiline",
    },
  ],

  // --- Paramétrage des absences ---
  typeAbsence: [
    { key: "nom", label: "Nom du type d’absence", type: "text" },
    { key: "code", label: "Code de l’absence", type: "text" },
    {
      key: "justificatif",
      label: "Justificatif requis",
      type: "toggle",
    },
    {
      key: "remunere",
      label: "Absence rémunérée",
      type: "toggle",
    },
    {
      key: "impactSolde",
      label: "Impact solde de congé",
      type: "toggle",
    },
    { key: "debut", label: "Date de début", type: "date" },
    { key: "fin", label: "Date de fin", type: "date" },
  ],
};

export default function CreateEntityDialog({
  open,
  entity,
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState({});

  // Réinitialise le form à chaque ouverture
  useEffect(() => {
    if (open) setForm({});
  }, [open]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    // Choisir la bonne API selon l'entité
    const createFn =
      entity === "typeCot" || entity === "cotisation" ? createCot : createParam;
    await createFn(entity, form);
    onCreated();
    onClose();
  };

  const fields = fieldDefinitions[entity] || [];

  // Titre dynamique
  const titles = {
    societe: "Créer une Société",
    contrat: "Créer un Type de contrat",
    categorie: "Créer une Catégorie",
    statut: "Créer un Statut",
    unite: "Créer une Unité",
    typeCot: "Créer un Type de cotisation",
    cotisation: "Créer une Cotisation",
    typeAbsence: "Créer un Type d’absence",
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{titles[entity] || `Créer ${entity}`}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {fields.map((f) => {
            if (f.type === "select") {
              return (
                <FormControl fullWidth key={f.key}>
                  <InputLabel id={`${f.key}-label`}>{f.label}</InputLabel>
                  <Select
                    labelId={`${f.key}-label`}
                    name={f.key}
                    value={form[f.key] || ""}
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
            if (f.type === "text-multiline") {
              return (
                <TextField
                  key={f.key}
                  fullWidth
                  multiline
                  rows={3}
                  label={f.label}
                  name={f.key}
                  value={form[f.key] || ""}
                  onChange={handleChange}
                />
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
            // type === "text" or "date"
            return (
              <TextField
                key={f.key}
                fullWidth
                type={f.type}
                label={f.label}
                name={f.key}
                InputLabelProps={
                  f.type === "date" ? { shrink: true } : undefined
                }
                value={form[f.key] || ""}
                onChange={handleChange}
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
