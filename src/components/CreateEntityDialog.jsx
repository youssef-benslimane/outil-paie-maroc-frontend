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
import { createOne as createParam } from "../api/fakeParamAdminApi.js";
import { createOne as createCot } from "../api/fakeCotisationsApi.js";
import { createOne as createAbs } from "../api/fakeAbsenceApi.js";
import { createOne as createPrime } from "../api/fakePrimeApi.js";
import { createOne as createBareme } from "../api/fakeBaremeApi.js";
import { createOne as createTemps } from "../api/fakeTempsApi.js";
import {
  createOne as createMotifMesure,
  getAll as getAllMesures,
} from "../api/fakeMotifMesureApi.js";
import {
  createOne as createProfil,
  getAll as getAllProfils,
  createOne as createGrille,
} from "../api/fakeProfilGrilleApi.js";

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
    { key: "tauxSalarial", label: "Taux salarial (%)", type: "number" },
    { key: "tauxPatronal", label: "Taux patronal (%)", type: "number" },
    { key: "plafondSalarial", label: "Plafond salarial", type: "number" },
    { key: "plafondPatronal", label: "Plafond patronal", type: "number" },
    { key: "debut", label: "Date début", type: "date" },
    { key: "fin", label: "Date fin", type: "date" },
    {
      key: "description",
      label: "Informations complémentaires",
      type: "text-multiline",
    },
  ],
  typeAbsence: [
    { key: "nom", label: "Nom du type d’absence", type: "text" },
    { key: "code", label: "Code de l’absence", type: "text" },
    { key: "justificatif", label: "Justificatif requis", type: "toggle" },
    { key: "remunere", label: "Absence rémunérée", type: "toggle" },
    { key: "impactSolde", label: "Impact solde de congé", type: "toggle" },
    { key: "debut", label: "Date de début", type: "date" },
    { key: "fin", label: "Date de fin", type: "date" },
  ],
  prime: [
    { key: "nom", label: "Nom de la prime/indemnité", type: "text" },
    { key: "code", label: "Code interne", type: "text" },
    {
      key: "typeMontant",
      label: "Type de montant",
      type: "select",
      options: ["Nombre", "Montant", "Pourcentage"],
    },
    { key: "montantFixe", label: "Montant fixe", type: "number" },
    { key: "taux", label: "Taux (%)", type: "number" },
    {
      key: "rubriqueSource",
      label: "Rubrique source",
      type: "select",
      options: ["Salaire de base", "Primes précédentes"],
    },
    { key: "valeurUnitaire", label: "Valeur unitaire", type: "number" },
    { key: "soumisCotisation", label: "Soumis à cotisation", type: "toggle" },
    { key: "soumisIR", label: "Soumis à l’IR", type: "toggle" },
    { key: "debut", label: "Date de début", type: "date" },
    { key: "fin", label: "Date de fin", type: "date" },
  ],
  tranches: [
    { key: "minimum", label: "Minimum", type: "number" },
    { key: "maximum", label: "Maximum", type: "number" },
    { key: "taux", label: "Taux IR (%)", type: "number" },
    { key: "deduction", label: "Montant déduction", type: "number" },
    { key: "debut", label: "Date de début", type: "date" },
    { key: "fin", label: "Date de fin", type: "date" },
  ],
  plafonds: [
    { key: "code", label: "Code constante", type: "text" },
    { key: "nom", label: "Nom constante", type: "text" },
    { key: "valeur", label: "Valeur", type: "number" },
    { key: "debut", label: "Date de début", type: "date" },
    { key: "fin", label: "Date de fin", type: "date" },
  ],
  holidays: [
    { key: "nom", label: "Nom du jour férié", type: "text" },
    { key: "dateExacte", label: "Date exacte du jour férié", type: "date" },
    { key: "debut", label: "Date début validité", type: "date" },
    { key: "fin", label: "Date fin validité", type: "date" },
  ],
  absenceTypes: [
    { key: "nom", label: "Nom de l’absence", type: "text" },
    { key: "code", label: "Code interne", type: "text" },
    { key: "decompte", label: "Décompte dans le solde", type: "toggle" },
    { key: "justificatif", label: "Justificatif requis", type: "toggle" },
    { key: "debut", label: "Date début", type: "date" },
    { key: "fin", label: "Date fin", type: "date" },
  ],
  mesures: [
    { key: "code", label: "Code Mesure", type: "text" },
    { key: "nom", label: "Nom de la mesure", type: "text" },
    { key: "debut", label: "Date début", type: "date" },
    { key: "fin", label: "Date fin", type: "date" },
  ],
  motifs: [
    { key: "code", label: "Code Motif", type: "text" },
    { key: "nom", label: "Nom du motif", type: "text" },
    {
      key: "mesureCode",
      label: "Mesure associée",
      type: "select",
      options: [], // sera rempli dynamiquement
    },
    { key: "debut", label: "Date début", type: "date" },
    { key: "fin", label: "Date fin", type: "date" },
  ],
  profils: [
    { key: "nom", label: "Nom du profil", type: "text" },
    {
      key: "categorie",
      label: "Catégorie associée",
      type: "select",
      options: ["Cadre", "Ouvrier", "Employé"],
    },
    { key: "poste", label: "Fonction / Poste type", type: "text" },
    { key: "salaireBase", label: "Salaire de base", type: "number" },
    {
      key: "primes",
      label: "Primes associées",
      type: "select",
      options: [
        "Prime de transport",
        "Indemnité de panier",
        "Prime de rendement",
      ],
    },
    { key: "debut", label: "Date de début", type: "date" },
    { key: "fin", label: "Date de fin", type: "date" },
  ],
  grilles: [
    {
      key: "profil",
      label: "Profil concerné",
      type: "select",
      options: [], // sera rempli dynamiquement
    },
    { key: "niveau", label: "Niveau", type: "text" },
    { key: "echelon", label: "Échelon", type: "text" },
    { key: "ancienneteMin", label: "Ancienneté minimale", type: "number" },
    { key: "salaireMin", label: "Salaire minimum", type: "number" },
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
  const [mesureOptions, setMesureOptions] = useState([]);
  const [profilOptions, setProfilOptions] = useState([]);

  useEffect(() => {
    if (!open) return;
    setForm({});

    // Si on crée un "motif", on charge les mesures
    if (entity === "motifs") {
      (async () => {
        const allMesures = await getAllMesures("mesures");
        const opts = allMesures.map((m) => ({
          value: m.code,
          label: `${m.code} – ${m.nom}`,
        }));
        setMesureOptions(opts);
      })();
    }

    // Si on crée une "grille", on charge les profils
    if (entity === "grilles") {
      (async () => {
        const allProfils = await getAllProfils("profils");
        const opts = allProfils.map((p) => ({
          value: p.nom,
          label: p.nom,
        }));
        setProfilOptions(opts);
      })();
    }
  }, [open, entity]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    let createFn;
    switch (entity) {
      case "typeCot":
      case "cotisation":
        createFn = createCot;
        break;
      case "typeAbsence":
        createFn = createAbs;
        break;
      case "prime":
        createFn = createPrime;
        break;
      case "tranches":
      case "plafonds":
        createFn = createBareme;
        break;
      case "holidays":
      case "absenceTypes":
        createFn = createTemps;
        break;
      case "mesures":
      case "motifs":
        createFn = createMotifMesure;
        break;
      case "profils":
        createFn = createProfil;
        break;
      case "grilles":
        createFn = createGrille;
        break;
      default:
        createFn = createParam;
    }
    await createFn(entity, form);
    onCreated();
    onClose();
  };

  const fields = fieldDefinitions[entity] || [];
  const titles = {
    societe: "Créer une Société",
    contrat: "Créer un Type de contrat",
    categorie: "Créer une Catégorie",
    statut: "Créer un Statut",
    unite: "Créer une Unité",
    typeCot: "Créer un Type de cotisation",
    cotisation: "Créer une Cotisation",
    typeAbsence: "Créer un Type d’absence",
    prime: "Créer une Prime / Indemnité",
    tranches: "Créer une Tranche IR",
    holidays: "Créer un Jour férié",
    absenceTypes: "Créer un Type d’absence",
    mesures: "Créer une Mesure disciplinaire",
    motifs: "Créer un Motif de mesure",
    profils: "Créer un Profil",
    grilles: "Créer une Grille salariale",
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{titles[entity] || `Créer ${entity}`}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {fields.map((f) => {
            // Si on est sur "motifs" et champ "mesureCode", utiliser mesureOptions
            if (entity === "motifs" && f.key === "mesureCode") {
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
                    {mesureOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }

            // Si on est sur "grilles" et champ "profil", utiliser profilOptions
            if (entity === "grilles" && f.key === "profil") {
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
