// src/api/fakeUserApi.js
let db = {
  users: [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      emailPro: "jean.dupont@company.com",
      matricule: "JD001",
      role: "Employé",
      actif: true,
      motDePasse: "password123",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Sophie",
      emailPro: "sophie.martin@company.com",
      matricule: "SM002",
      role: "RH",
      actif: true,
      motDePasse: "password123",
    },
  ],
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Récupère tous les utilisateurs
export const getAllUsers = async () => {
  await delay(300);
  return [...db.users];
};

// Récupère un utilisateur par son ID
export const getUserById = async (id) => {
  await delay(300);
  return db.users.find((u) => u.id === parseInt(id, 10));
};

// Crée un nouvel utilisateur
export const createUser = async (user) => {
  await delay(300);
  const newRec = {
    id: Date.now(),
    nom: user.nom || "",
    prenom: user.prenom || "",
    emailPro: user.emailPro || "",
    matricule: user.matricule || "",
    role: user.role || "",
    actif: user.actif ?? true,
    motDePasse: user.motDePasse || "changeme123",
  };
  db.users.push(newRec);
  return newRec;
};

// Met à jour un utilisateur existant
export const updateUser = async (id, upd) => {
  await delay(300);
  db.users = db.users.map((u) =>
    u.id === parseInt(id, 10) ? { ...u, ...upd, id: u.id } : u
  );
  return db.users.find((u) => u.id === parseInt(id, 10));
};

// Supprime un utilisateur (ou le désactive si besoin)
export const deleteUser = async (id) => {
  await delay(300);
  db.users = db.users.filter((u) => u.id !== parseInt(id, 10));
};

// Réinitialise le mot de passe d'un utilisateur
export const resetUserPassword = async (id, newPassword) => {
  await delay(300);
  db.users = db.users.map((u) =>
    u.id === parseInt(id, 10) ? { ...u, motDePasse: newPassword } : u
  );
  return db.users.find((u) => u.id === parseInt(id, 10));
};
