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
  Button,
} from "@mui/material";
import { createOne } from "../api/fakeParamAdminApi.js";

export const fieldDefinitions = {
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
};

export default function CreateEntityDialog({
  open,
  entity,
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState({});

  // reset form à chaque ouverture
  useEffect(() => {
    if (open) setForm({});
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    await createOne(entity, form);
    onCreated();
    onClose();
  };

  const fields = fieldDefinitions[entity] || [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Créer un(e) {entity}</DialogTitle>
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
            } else if (f.type === "text-multiline") {
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
            } else {
              return (
                <TextField
                  key={f.key}
                  fullWidth
                  type={f.type}
                  label={f.label}
                  name={f.key}
                  InputLabelProps={f.type === "date" ? { shrink: true } : {}}
                  value={form[f.key] || ""}
                  onChange={handleChange}
                />
              );
            }
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
