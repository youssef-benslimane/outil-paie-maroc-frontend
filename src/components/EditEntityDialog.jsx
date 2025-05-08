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
  Button,
} from "@mui/material";
import { getOne, updateOne } from "../api/fakeParamAdminApi.js";

// on réutilise fieldDefinitions de CreateEntityDialog
import { fieldDefinitions } from "./CreateEntityDialog";

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
      getOne(entity, id).then((data) => setForm(data || {}));
    }
  }, [open, entity, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    await updateOne(entity, id, form);
    onUpdated();
    onClose();
  };

  const fields = fieldDefinitions[entity] || [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier un(e) {entity}</DialogTitle>
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
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
}
