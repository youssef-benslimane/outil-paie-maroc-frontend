// src/components/CreateUserDialog.jsx
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
import { createUser } from "../api/fakeUserApi.js";

export default function CreateUserDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    emailPro: "",
    matricule: "",
    role: "",
    actif: true,
  });

  // Réinitialiser le formulaire à chaque ouverture
  useEffect(() => {
    if (!open) return;
    setForm({
      nom: "",
      prenom: "",
      emailPro: "",
      matricule: "",
      role: "",
      actif: true,
    });
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    // Appel à l'API pour créer l'utilisateur
    await createUser(form);
    onCreated();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Créer un utilisateur</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Prénom"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Email professionnel"
            name="emailPro"
            type="email"
            value={form.emailPro}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Matricule interne"
            name="matricule"
            value={form.matricule}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel id="role-label">Rôle attribué</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={form.role}
              label="Rôle attribué"
              onChange={handleChange}
            >
              <MenuItem value="Employé">Employé</MenuItem>
              <MenuItem value="RH">RH</MenuItem>
              <MenuItem value="Paramétreur">Paramétreur</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                name="actif"
                checked={form.actif}
                onChange={handleChange}
              />
            }
            label="Activer le compte"
          />
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
