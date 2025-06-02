// src/api/fakeProfilGrilleApi.js

// --- Base de données en mémoire ---
let db = {
  profils: [
    {
      id: 1,
      nom: "Cadre commercial",
      categorie: "Cadre",
      poste: "Responsable des ventes",
      salaireBase: 10000,
      primes: ["Prime de transport", "Indemnité de panier"],
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 2,
      nom: "Technicien",
      categorie: "Ouvrier",
      poste: "Technicien de maintenance",
      salaireBase: 6000,
      primes: ["Prime de rendement"],
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
  ],
  grilles: [
    {
      id: 1,
      profil: "Cadre commercial",
      niveau: "1",
      echelon: "A",
      ancienneteMin: 0,
      salaireMin: 10000,
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 2,
      profil: "Technicien",
      niveau: "1",
      echelon: "B",
      ancienneteMin: 0,
      salaireMin: 6000,
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
  ],
};

// simulate network delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// get all records of an entity ("profils" or "grilles")
export const getAll = async (entity) => {
  await delay(300);
  return [...(db[entity] || [])];
};

// get one record by id
export const getOne = async (entity, id) => {
  await delay(300);
  if (!db[entity]) return null;
  return db[entity].find((item) => item.id === parseInt(id, 10));
};

// create a new record
export const createOne = async (entity, record) => {
  await delay(300);
  const newRec = { id: Date.now(), ...record };
  if (!db[entity]) db[entity] = [];
  db[entity].push(newRec);
  return newRec;
};

// update an existing record
export const updateOne = async (entity, id, updated) => {
  await delay(300);
  if (!db[entity]) return null;
  db[entity] = db[entity].map((r) => (r.id === id ? { ...r, ...updated } : r));
  return db[entity].find((r) => r.id === id);
};

// delete a record
export const deleteOne = async (entity, id) => {
  await delay(300);
  if (!db[entity]) return;
  db[entity] = db[entity].filter((r) => r.id !== id);
};
