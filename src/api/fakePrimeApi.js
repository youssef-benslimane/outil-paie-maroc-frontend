// src/api/fakePrimeApi.js

// --- Base de données en mémoire ---
let db = {
  prime: [
    {
      id: 1,
      nom: "Prime de transport",
      code: "PR_TRANSP",
      typeMontant: "Montant",
      montantFixe: 500,
      taux: 10,
      rubriqueSource: "Salaire de base",
      valeurUnitaire: 15,
      soumisCotisation: true,
      soumisIR: true,
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 2,
      nom: "Indemnité panier",
      code: "IND_PANIER",
      typeMontant: "Pourcentage",
      montantFixe: 25,
      taux: 10,
      rubriqueSource: "Salaire de base",
      valeurUnitaire: 3,
      soumisCotisation: false,
      soumisIR: true,
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
  ],
};

// Simule un délai réseau
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Récupère tous les enregistrements d'un type
export const getAll = async (entity) => {
  await delay(300);
  return [...(db[entity] || [])];
};

// Crée un nouvel enregistrement
export const createOne = async (entity, record) => {
  await delay(300);
  const newRec = { id: Date.now(), ...record };
  if (!db[entity]) db[entity] = [];
  db[entity].push(newRec);
  return newRec;
};

// Met à jour un enregistrement existant
export const updateOne = async (entity, id, updated) => {
  await delay(300);
  if (!db[entity]) return null;
  db[entity] = db[entity].map((r) => (r.id === id ? { ...r, ...updated } : r));
  return db[entity].find((r) => r.id === id);
};

// Supprime un enregistrement
export const deleteOne = async (entity, id) => {
  await delay(300);
  if (!db[entity]) return;
  db[entity] = db[entity].filter((r) => r.id !== id);
};

// Récupère un enregistrement unique
export const getOne = async (entity, id) => {
  await delay(300);
  if (!db[entity]) return null;
  return db[entity].find((item) => item.id === parseInt(id, 10));
};
