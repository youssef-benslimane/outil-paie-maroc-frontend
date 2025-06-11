import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Button,
  Toolbar,
} from "@mui/material";
import RhSidebar from "../components/RhSidebar.jsx";

export default function GestionAdminSalariesPage() {
  const [tab, setTab] = useState(0);
  const drawerWidth = 240;
  // Données personnelles
  const [personal, setPersonal] = useState({
    nom: "",
    prenom: "",
    cin: "",
    sexe: "",
    dateNaissance: "",
    lieuNaissance: "",
    nationalite: "",
    situationFamiliale: "",
    nbEnfants: "",
    adresse: "",
    ville: "",
    telephone: "",
    emailPerso: "",
    langues: [],
    urgence: "",
    permis: [],
    mobilite: false,
  });

  // Contrats
  const [contrat, setContrat] = useState({
    matricule: "",
    dateEmbauche: "",
    dateAnciennete: "",
    dateFin: "",
    profil: "",
    categorieSalaire: "",
    statut: "",
    typeContrat: "",
    fonction: "",
    societe: "",
    departement: "",
    service: "",
    cimr: "",
    mutuelle: "",
    responsable: "",
    modeTravail: "",
    emailPro: "",
  });

  // Rémunérations
  const [remu, setRemu] = useState({
    rib: "",
    banque: "",
    salaireBase: "",
    tauxActivite: "",
    modePaiement: "",
  });

  // Options statiques (adapter ou remplacer par appels API)
  const sexes = ["Homme", "Femme"];
  const nationalites = ["Marocaine", "Française", "Autre"];
  const situations = ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf(ve)"];
  const languesOpts = ["Français", "Arabe", "Anglais"];
  const permisOpts = ["A", "B", "C"];
  const profils = ["Administrateur", "Configurateur", "Employé Simple", "RH"];
  const categoriesSalaire = ["Permanent", "Occasionnel", "Stagiaire"];
  const statuts = [
    "Cadre dirigeant",
    "Cadre",
    "Ouvrier",
    "Employé",
    "Agent de maîtrise",
  ];
  const typesContrat = ["CDI", "CDD", "Stage"];
  const fonctions = ["Poste A", "Poste B"];
  const societes = ["Société A", "Société B"];
  const departements = ["Département 1", "Département 2"];
  const services = ["Service X", "Service Y"];
  const banques = ["Banque A", "Banque B"];
  const modesPaiement = ["Virement", "Chèque", "Espèces"];
  const modesTravail = ["Présentiel", "Télétravail", "Hybride"];

  const handleTabChange = (_, value) => setTab(value);

  return (
    <Box sx={{ display: "flex" }}>
      <RhSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        <Container maxWidth="md" sx={{ mx: "auto" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Gestion Administrateur Salariés
          </Typography>

          <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
            <Tab label="Données personnelles" />
            <Tab label="Contrats" />
            <Tab label="Rémunérations" />
          </Tabs>

          {tab === 0 && (
            <Box
              component="form"
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                label="Nom"
                value={personal.nom}
                onChange={(e) =>
                  setPersonal({ ...personal, nom: e.target.value })
                }
                required
              />
              <TextField
                label="Prénom"
                value={personal.prenom}
                onChange={(e) =>
                  setPersonal({ ...personal, prenom: e.target.value })
                }
                required
              />
              <TextField
                label="CIN"
                value={personal.cin}
                onChange={(e) =>
                  setPersonal({ ...personal, cin: e.target.value })
                }
                required
              />
              <FormControl fullWidth>
                <InputLabel>Sexe</InputLabel>
                <Select
                  value={personal.sexe}
                  label="Sexe"
                  onChange={(e) =>
                    setPersonal({ ...personal, sexe: e.target.value })
                  }
                  required
                >
                  {sexes.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Date de naissance"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={personal.dateNaissance}
                onChange={(e) =>
                  setPersonal({
                    ...personal,
                    dateNaissance: e.target.value,
                  })
                }
                required
              />
              <TextField
                label="Lieu de naissance"
                value={personal.lieuNaissance}
                onChange={(e) =>
                  setPersonal({
                    ...personal,
                    lieuNaissance: e.target.value,
                  })
                }
                required
              />
              <FormControl fullWidth>
                <InputLabel>Nationalité</InputLabel>
                <Select
                  value={personal.nationalite}
                  label="Nationalité"
                  onChange={(e) =>
                    setPersonal({
                      ...personal,
                      nationalite: e.target.value,
                    })
                  }
                  required
                >
                  {nationalites.map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Situation familiale</InputLabel>
                <Select
                  value={personal.situationFamiliale}
                  label="Situation familiale"
                  onChange={(e) =>
                    setPersonal({
                      ...personal,
                      situationFamiliale: e.target.value,
                    })
                  }
                  required
                >
                  {situations.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Nombre d’enfants à charge"
                type="number"
                value={personal.nbEnfants}
                onChange={(e) =>
                  setPersonal({
                    ...personal,
                    nbEnfants: e.target.value,
                  })
                }
                required
              />
              <TextField
                label="Adresse"
                multiline
                rows={2}
                value={personal.adresse}
                onChange={(e) =>
                  setPersonal({ ...personal, adresse: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label="Ville"
                value={personal.ville}
                onChange={(e) =>
                  setPersonal({ ...personal, ville: e.target.value })
                }
                required
              />
              <TextField
                label="Téléphone"
                value={personal.telephone}
                onChange={(e) =>
                  setPersonal({
                    ...personal,
                    telephone: e.target.value,
                  })
                }
              />
              <TextField
                label="Email perso"
                type="email"
                value={personal.emailPerso}
                onChange={(e) =>
                  setPersonal({
                    ...personal,
                    emailPerso: e.target.value,
                  })
                }
              />
              <Autocomplete
                multiple
                options={languesOpts}
                value={personal.langues}
                onChange={(_, val) =>
                  setPersonal({ ...personal, langues: val })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Langues parlées" />
                )}
              />
              <TextField
                label="Personne à contacter (urgence)"
                value={personal.urgence}
                onChange={(e) =>
                  setPersonal({ ...personal, urgence: e.target.value })
                }
              />
              <Autocomplete
                multiple
                options={permisOpts}
                value={personal.permis}
                onChange={(_, val) => setPersonal({ ...personal, permis: val })}
                renderInput={(params) => (
                  <TextField {...params} label="Permis de conduire" />
                )}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={personal.mobilite}
                    onChange={(e) =>
                      setPersonal({
                        ...personal,
                        mobilite: e.target.checked,
                      })
                    }
                  />
                }
                label="Mobilité géographique"
              />
            </Box>
          )}

          {tab === 1 && (
            <Box
              component="form"
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                label="Matricule"
                value={contrat.matricule}
                disabled
                fullWidth
                required
              />
              <TextField
                label="Date d’embauche"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={contrat.dateEmbauche}
                onChange={(e) =>
                  setContrat({
                    ...contrat,
                    dateEmbauche: e.target.value,
                  })
                }
                required
              />
              <TextField
                label="Date d'ancienneté"
                value={contrat.dateAnciennete}
                onChange={(e) =>
                  setContrat({
                    ...contrat,
                    dateAnciennete: e.target.value,
                  })
                }
                required
              />
              <TextField
                label="Date de fin de contrat"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={contrat.dateFin}
                onChange={(e) =>
                  setContrat({ ...contrat, dateFin: e.target.value })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Type de profil</InputLabel>
                <Select
                  value={contrat.profil}
                  label="Type de profil"
                  onChange={(e) =>
                    setContrat({ ...contrat, profil: e.target.value })
                  }
                >
                  {profils.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Catégorie de salaire"
                value={contrat.categorieSalaire}
                onChange={(e) =>
                  setContrat({
                    ...contrat,
                    categorieSalaire: e.target.value,
                  })
                }
                required
              />
              <FormControl fullWidth>
                <InputLabel>Statut du salarié</InputLabel>
                <Select
                  value={contrat.statut}
                  label="Statut du salarié"
                  onChange={(e) =>
                    setContrat({ ...contrat, statut: e.target.value })
                  }
                  required
                >
                  {statuts.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Type de contrat</InputLabel>
                <Select
                  value={contrat.typeContrat}
                  label="Type de contrat"
                  onChange={(e) =>
                    setContrat({
                      ...contrat,
                      typeContrat: e.target.value,
                    })
                  }
                  required
                >
                  {typesContrat.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Fonction</InputLabel>
                <Select
                  value={contrat.fonction}
                  label="Fonction"
                  onChange={(e) =>
                    setContrat({ ...contrat, fonction: e.target.value })
                  }
                  required
                >
                  {fonctions.map((f) => (
                    <MenuItem key={f} value={f}>
                      {f}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Société</InputLabel>
                <Select
                  value={contrat.societe}
                  label="Société"
                  onChange={(e) =>
                    setContrat({ ...contrat, societe: e.target.value })
                  }
                  required
                >
                  {societes.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Département</InputLabel>
                <Select
                  value={contrat.departement}
                  label="Département"
                  onChange={(e) =>
                    setContrat({
                      ...contrat,
                      departement: e.target.value,
                    })
                  }
                >
                  {departements.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Service</InputLabel>
                <Select
                  value={contrat.service}
                  label="Service"
                  onChange={(e) =>
                    setContrat({ ...contrat, service: e.target.value })
                  }
                >
                  {services.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="N° CIMR"
                value={contrat.cimr}
                onChange={(e) =>
                  setContrat({ ...contrat, cimr: e.target.value })
                }
              />
              <TextField
                label="N° mutuelle"
                value={contrat.mutuelle}
                onChange={(e) =>
                  setContrat({ ...contrat, mutuelle: e.target.value })
                }
              />
              <TextField
                label="Responsable hiérarchique"
                type="number"
                value={contrat.responsable}
                onChange={(e) =>
                  setContrat({
                    ...contrat,
                    responsable: e.target.value,
                  })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Mode de travail</InputLabel>
                <Select
                  value={contrat.modeTravail}
                  label="Mode de travail"
                  onChange={(e) =>
                    setContrat({
                      ...contrat,
                      modeTravail: e.target.value,
                    })
                  }
                >
                  {modesTravail.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Email professionnel"
                type="email"
                value={contrat.emailPro}
                onChange={(e) =>
                  setContrat({
                    ...contrat,
                    emailPro: e.target.value,
                  })
                }
              />
            </Box>
          )}

          {tab === 2 && (
            <Box
              component="form"
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                label="RIB"
                value={remu.rib}
                onChange={(e) => setRemu({ ...remu, rib: e.target.value })}
                required
              />
              <FormControl fullWidth>
                <InputLabel>Banque</InputLabel>
                <Select
                  value={remu.banque}
                  label="Banque"
                  onChange={(e) => setRemu({ ...remu, banque: e.target.value })}
                  required
                >
                  {banques.map((b) => (
                    <MenuItem key={b} value={b}>
                      {b}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Salaire de base"
                type="number"
                value={remu.salaireBase}
                onChange={(e) =>
                  setRemu({ ...remu, salaireBase: e.target.value })
                }
                required
              />
              <TextField
                label="Taux d'activité (%)"
                type="number"
                value={remu.tauxActivite}
                onChange={(e) =>
                  setRemu({ ...remu, tauxActivite: e.target.value })
                }
                required
              />
              <FormControl fullWidth>
                <InputLabel>Mode de paiement</InputLabel>
                <Select
                  value={remu.modePaiement}
                  label="Mode de paiement"
                  onChange={(e) =>
                    setRemu({ ...remu, modePaiement: e.target.value })
                  }
                  required
                >
                  {modesPaiement.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}
