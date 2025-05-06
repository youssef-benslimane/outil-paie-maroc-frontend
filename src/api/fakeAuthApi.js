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

export const fakeForgotPassword = async ({ email }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mail = email.trim().toLowerCase();
      switch (mail) {
        case "admin@demo.com":
          resolve({
            message:
              "Pour un administrateur, un e-mail de réinitialisation directe du mot de passe a été envoyé.",
          });
          break;
        case "rh@demo.com":
          resolve({
            message:
              "Un e-mail a été envoyé à un autre responsable RH pour traitement de votre demande.",
          });
          break;
        case "employe@demo.com":
        case "config@demo.com":
          resolve({
            message:
              "Un e-mail a été envoyé à votre adresse et à l’équipe RH (Nom & Prénom).",
          });
          break;
        default:
          resolve({
            message:
              "Si ce compte existe, vous recevrez bientôt un e-mail avec les instructions.",
          });
      }
    }, 500);
  });
};

export const fakeGetProfile = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        nom: "Benslimane",
        prenom: "Youssef",
        username: "ybh",
        cin: "A12345678",
        email_pro: "youssef@entreprise.com",
        email_perso: "youssef@perso.com",
        adresse: "123 rue Exemple",
        ville: "Casablanca",
        telephone: "0612345678",
        date_naissance: "1990-01-01",
        lieu_naissance: "Rabat",
        genre: "M",
        nationalite: "Marocaine",
        situation_familiale: "Célibataire",
        enfants_a_charge: "0",
        permis_conduire: true,
        mobilite_geographique: "Oui",
        langues_parlees: "Français, Anglais, Arabe",
        contact_urgence: "Ami: 0623456789",
        etat_compte: "Actif",
        date_creation: "2025-03-26",
        date_modification: "2025-04-29",
      });
    }, 500);
  });
};
