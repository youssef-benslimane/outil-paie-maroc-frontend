// src/api/fakeElementsVariablesPaieApi.js

// --- Base de données en mémoire ---
let db = {
  // Absences
  absences: [
    {
      id: 1,
      matricule: "A001",
      typeAbsence: "CP",
      dateDebut: "2025-01-10",
      dateFin: "2025-01-15",
    },
    {
      id: 2,
      matricule: "A002",
      typeAbsence: "Maladie",
      dateDebut: "2025-02-05",
      dateFin: "2025-02-07",
    },
  ],

  // Indemnités / Primes & Retenues
  indemnites: [
    {
      id: 1,
      matricule: "A001",
      rubrique: "PREX",
      designation: "Prime exceptionnelle",
      nombre: 1,
      montant: 1000,
      dateDebut: "2025-01-01",
      dateFin: "2025-01-31",
    },
    {
      id: 2,
      matricule: "A002",
      rubrique: "INDP",
      designation: "Indemnité de panier",
      nombre: 20,
      montant: 5,
      dateDebut: "2025-02-01",
      dateFin: "2025-12-31",
    },
  ],
};

// Simule un délai réseau
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Récupère toutes les fiches d'une entité (absences ou indemnites)
 * @param {string} entity
 */
export const getAll = async (entity) => {
  await delay(300);
  return [...db[entity]];
};

/**
 * Récupère un enregistrement unique
 * @param {string} entity
 * @param {number|string} id
 */
export const getOne = async (entity, id) => {
  await delay(300);
  return db[entity].find((item) => item.id === parseInt(id, 10));
};

/**
 * Crée un nouvel enregistrement
 * @param {string} entity
 * @param {object} record
 */
export const createOne = async (entity, record) => {
  await delay(300);
  const newRec = { id: Date.now(), ...record };
  db[entity].push(newRec);
  return newRec;
};

/**
 * Met à jour un enregistrement existant
 * @param {string} entity
 * @param {number|string} id
 * @param {object} updated
 */
export const updateOne = async (entity, id, updated) => {
  await delay(300);
  db[entity] = db[entity].map((r) =>
    r.id === parseInt(id, 10) ? { ...r, ...updated } : r
  );
  return db[entity].find((r) => r.id === parseInt(id, 10));
};

/**
 * Supprime un enregistrement
 * @param {string} entity
 * @param {number|string} id
 */
export const deleteOne = async (entity, id) => {
  await delay(300);
  db[entity] = db[entity].filter((r) => r.id !== parseInt(id, 10));
};
