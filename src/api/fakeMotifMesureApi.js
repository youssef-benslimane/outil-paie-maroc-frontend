// src/api/fakeMotifMesureApi.js

// --- Base de données en mémoire ---
let db = {
  mesures: [
    {
      id: 1,
      code: "ME0",
      nom: "Mesure d'embauche",
      motifs: ["Création de poste", "Remplacement"],
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 2,
      code: "ME1",
      nom: "Mesure de changement de contrat",
      motifs: ["Passage CDI", "Augmentation de salaire"],
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 3,
      code: "ME2",
      nom: "Mesure de sortie",
      motifs: ["Démission", "Licenciement"],
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
  ],
  motifs: [
    {
      id: 1,
      code: "MO0",
      nom: "Création de poste",
      designation: "Nouveau poste créé",
      mesureCode: "ME1",
      debut: "2025-01-01",
      fin: "9999-12-31",
    },

    {
      id: 3,
      code: "MO1",
      nom: "Passage CDI",
      designation: "Transformation de CDD en CDI",
      mesureCode: "ME3",
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 4,
      code: "MO2",
      nom: "Augmentation de salaire",
      designation: "Révision à la hausse du salaire",
      mesureCode: "ME1",
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 5,
      code: "MO3",
      nom: "Démission",
      designation: "Départ volontaire du collaborateur",
      mesureCode: "ME2",
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 6,
      code: "MO4",
      nom: "Licenciement",
      designation: "Fin de contrat pour motif disciplinaire ou économique",
      mesureCode: "ME2",
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 2,
      code: "MO5",
      nom: "Remplacement",
      designation: "Remplacement d’un collaborateur",
      mesureCode: "ME3",
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
  ],
};

// Simule un délai réseau
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Récupère tous les enregistrements d'un type ("mesures" ou "motifs")
export const getAll = async (entity) => {
  await delay(200);
  return [...(db[entity] || [])];
};

// Crée un nouvel enregistrement
export const createOne = async (entity, record) => {
  await delay(200);
  const newRec = { id: Date.now(), ...record };
  if (!db[entity]) db[entity] = [];
  db[entity].push(newRec);
  return newRec;
};

// Met à jour un enregistrement existant
export const updateOne = async (entity, id, updated) => {
  await delay(200);
  if (!db[entity]) return null;
  db[entity] = db[entity].map((r) => (r.id === id ? { ...r, ...updated } : r));
  return db[entity].find((r) => r.id === id);
};

// Supprime un enregistrement
export const deleteOne = async (entity, id) => {
  await delay(200);
  if (!db[entity]) return;
  db[entity] = db[entity].filter((r) => r.id !== id);
};

// Récupère un enregistrement unique
export const getOne = async (entity, id) => {
  await delay(200);
  if (!db[entity]) return null;
  return db[entity].find((item) => item.id === parseInt(id, 10)) || null;
};
