// src/api/fakeAuthApi.js
export const fakeLogin = async ({ email, password }) => {
  console.log("fakeLogin reçu:", { email, password }); // debug

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // normalisation de l'email
      const mail = email.trim().toLowerCase();

      // 4 comptes de test
      const users = {
        "admin@demo.com": { role: "ADMIN", nom: "Admin", prenom: "Demo" },
        "rh@demo.com": { role: "RH", nom: "Ressources", prenom: "Humaines" },
        "employe@demo.com": { role: "EMPLOYE", nom: "Employe", prenom: "Test" },
        "config@demo.com": {
          role: "CONFIGURATEUR",
          nom: "Config",
          prenom: "Test",
        },
      };

      const user = users[mail];
      if (user && password === "password") {
        return resolve({
          token: `fake-jwt-token-${user.role}`,
          user: {
            id: Date.now(),
            nom: user.nom,
            prenom: user.prenom,
            role: user.role,
          },
        });
      }

      return reject(new Error("Email ou mot de passe invalide"));
    }, 500);
  });
};
