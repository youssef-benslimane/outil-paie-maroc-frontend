// src/components/EditUserDialog.jsx
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
import { getUserById, updateUser } from "../api/fakeUserApi.js";

export default function EditUserDialog({ open, id, onClose, onUpdated }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    emailPro: "",
    matricule: "",
    role: "",
    actif: true,
  });

  // Charger les données de l'utilisateur à modifier
  useEffect(() => {
    if (!open || id == null) return;
    (async () => {
      const data = await getUserById(id);
      if (data) {
        setForm({
          nom: data.nom || "",
          prenom: data.prenom || "",
          emailPro: data.emailPro || "",
          matricule: data.matricule || "",
          role: data.role || "",
          actif: data.actif ?? true,
        });
      }
    })();
  }, [open, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    await updateUser(id, form);
    onUpdated();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier l’utilisateur</DialogTitle>
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
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
}
