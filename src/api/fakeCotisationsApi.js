// src/api/fakeParamCotisationApi.js

// --- Base de données en mémoire ---
let db = {
  // Onglet Type de cotisations
  typeCot: [
    {
      id: 1,
      nom: "CNSS",
      description: "Caisse Nationale de Sécurité Sociale",
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 2,
      nom: "CIMR",
      description: "Caisse Interprofessionnelle Marocaine de Retraite",
      debut: "2025-02-01",
      fin: "9999-12-31",
    },
  ],

  // Onglet Paramétrage de cotisation
  cotisation: [
    {
      id: 1,
      type: "CNSS",
      code: "COT_CNSS_PAT",
      nom: "Cotisation CNSS patronale",
      tauxSalarial: 4.48,
      tauxPatronal: 10.45,
      plafondSalarial: 6000,
      plafondPatronal: 6000,
      debut: "2025-01-01",
      fin: "9999-12-31",
      description: "Part patronale CNSS",
    },
    {
      id: 2,
      type: "CIMR",
      code: "COT_CIMR_SAL",
      nom: "Cotisation CIMR salariale",
      tauxSalarial: 6.0,
      tauxPatronal: 0.0,
      plafondSalarial: 8000,
      plafondPatronal: 0,
      debut: "2025-03-01",
      fin: "9999-12-31",
      description: "Part salariale CIMR",
    },
  ],
};

// Simule un délai réseau
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Récupère tous les enregistrements d'un type (typeCot ou cotisation)
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
