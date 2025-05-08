// src/api/fakeParamAdminApi.js

// --- Base de données en mémoire ---
let db = {
  societe: [
    {
      id: 1,
      nom: "Exemple SARL",
      ville: "Casablanca",
      identFiscal: "CIF123",
      cnss: "CNSS456",
      ice: "ICE789",
      rc: "RC012",
      debut: "2025-01-01",
      fin: "2026-01-01",
    },
  ],
  contrat: [
    {
      id: 1,
      code: "CDI",
      nom: "Contrat Durée Indéterminée",
      essai: "3 mois",
      conditions: "Période renouvelable une fois.",
      debut: "2025-01-01",
      fin: "2026-01-01",
    },
  ],
  categorie: [
    {
      id: 1,
      code: "CADRE",
      nom: "Cadre",
      description: "Catégorie cadre supérieur",
      debut: "2025-01-01",
      fin: "2025-12-31",
    },
  ],
  statut: [
    {
      id: 1,
      code: "ACTIF",
      nom: "Actif",
      description: "Salarié en activité normale",
      debut: "2025-01-01",
      fin: "9999-12-31", // sans date de fin par défaut
    },
  ],
  unite: [
    {
      id: 1,
      code: "DPT_RH",
      nom: "Département RH",
      type: "Département",
      parent: null,
      description: "Service des ressources humaines",
      statut: "Actif",
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 2,
      code: "SRV_IT",
      nom: "Service IT",
      type: "Service",
      parent: "DPT_RH",
      description: "Support et développement informatique",
      statut: "Actif",
      debut: "2025-02-01",
      fin: "9999-12-31",
    },
  ],
};

// Simule un délai réseau
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Récupère tous les enregistrements d'un type
export const getAll = async (entity) => {
  await delay(300);
  return [...db[entity]];
};

// Crée un nouvel enregistrement
export const createOne = async (entity, record) => {
  await delay(300);
  const newRec = { id: Date.now(), ...record };
  db[entity].push(newRec);
  return newRec;
};

// Met à jour un enregistrement existant
export const updateOne = async (entity, id, updated) => {
  await delay(300);
  db[entity] = db[entity].map((r) => (r.id === id ? { ...r, ...updated } : r));
  return db[entity].find((r) => r.id === id);
};

// Supprime un enregistrement
export const deleteOne = async (entity, id) => {
  await delay(300);
  db[entity] = db[entity].filter((r) => r.id !== id);
};

// Récupère un enregistrement unique
export const getOne = async (entity, id) => {
  await delay(300);
  return db[entity].find((item) => item.id === parseInt(id, 10));
};
