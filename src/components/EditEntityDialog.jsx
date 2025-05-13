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
// API ParamAdmin
import {
  getOne as getParam,
  updateOne as updateParam,
} from "../api/fakeParamAdminApi.js";
// API Cotisations
import {
  getOne as getCot,
  updateOne as updateCot,
} from "../api/fakeCotisationsApi.js";
// Définitions des champs (réutilise celles de CreateEntityDialog)
import { fieldDefinitions } from "./CreateEntityDialog.jsx";

export default function EditEntityDialog({
  open,
  entity,
  id,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (open && id != null) {
      // Choisir la bonne API de lecture
      const fetchFn =
        entity === "typeCot" || entity === "cotisation" ? getCot : getParam;
      fetchFn(entity, id).then((data) => setForm(data || {}));
    }
  }, [open, entity, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    // Choisir la bonne API de mise à jour
    const updateFn =
      entity === "typeCot" || entity === "cotisation" ? updateCot : updateParam;
    await updateFn(entity, id, form);
    onUpdated();
    onClose();
  };

  const fields = fieldDefinitions[entity] || [];

  // Titres adaptés
  const titles = {
    societe: "Modifier une Société",
    contrat: "Modifier un Type de contrat",
    categorie: "Modifier une Catégorie",
    statut: "Modifier un Statut",
    unite: "Modifier une Unité",
    typeCot: "Modifier un Type de cotisation",
    cotisation: "Modifier une Cotisation",
    typeAbsence: "Modifier un Type d’absence",
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{titles[entity] || `Modifier ${entity}`}</DialogTitle>
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
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
}
