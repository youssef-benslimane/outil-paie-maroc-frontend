// src/api/fakeTempsApi.js
let db = {
  holidays: [
    {
      id: 1,
      nom: "1er Mai",
      dateExacte: "2024-05-01",
      debut: "2023-01-01",
      fin: "2030-12-31",
    },
    {
      id: 2,
      nom: "Aid El Fitr",
      dateExacte: "2025-04-10",
      debut: "2025-03-01",
      fin: "2025-04-10",
    },
  ],
  absenceTypes: [
    {
      id: 1,
      nom: "Congé payé",
      code: "CP",
      decompte: true,
      justificatif: true,
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
    {
      id: 2,
      nom: "Récupération",
      code: "REC",
      decompte: false,
      justificatif: false,
      debut: "2025-01-01",
      fin: "9999-12-31",
    },
  ],
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getAll = async (entity) => {
  await delay(300);
  return [...(db[entity] || [])];
};

export const getOne = async (entity, id) => {
  await delay(300);
  return (db[entity] || []).find((x) => x.id === parseInt(id, 10));
};

export const createOne = async (entity, rec) => {
  await delay(300);
  const newRec = { id: Date.now(), ...rec };
  db[entity] = db[entity] || [];
  db[entity].push(newRec);
  return newRec;
};

export const updateOne = async (entity, id, upd) => {
  await delay(300);
  db[entity] = (db[entity] || []).map((x) =>
    x.id === id ? { ...x, ...upd } : x
  );
  return db[entity].find((x) => x.id === id);
};

export const deleteOne = async (entity, id) => {
  await delay(300);
  db[entity] = (db[entity] || []).filter((x) => x.id !== id);
};
