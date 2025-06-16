import axios from "axios";

/**
 * Envoie une requête POST vers /api/login (via le proxy React vers http://localhost:8080)
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: Object }>}
 * @throws {Error} En cas d’échec d’authentification ou d’erreur réseau
 */
export async function loginRequest({ email, password }) {
  try {
    const response = await axios.post(
      "/api/login",
      {
        username: email,
        password: password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // On s’attend à ce que le backend renvoie :
    // {
    //   user: { id: "...", role: "...", nom: "...", prenom: "...", email: "..." },
    //   token: "eyJhbGciOiJIUzI1NiJ9..."
    // }
    return {
      token: response.data.token,
      user: response.data.user,
    };
  } catch (err) {
    if (err.response) {
      // Le backend a répondu avec un statut 4xx/5xx
      throw new Error(err.response.data.message || "Identifiants invalides");
    } else {
      // Pas de réponse (erreur réseau, backend indisponible, etc.)
      throw new Error("Impossible de joindre le serveur");
    }
  }
}

/**
 * Envoie une requête POST vers /api/token/refresh pour obtenir un nouveau JWT.
 * À utiliser si votre backend propose un endpoint de rafraîchissement de token.
 * @returns {Promise<string>} Nouveau token JWT
 * @throws {Error} En cas d’échec ou d’erreur réseau
 */
export async function refreshTokenRequest() {
  try {
    const response = await axios.post(
      "/api/token/refresh",
      {},
      {
        withCredentials: true, // si vous gérez les cookies HTTP-only pour le refresh token
        headers: { "Content-Type": "application/json" },
      }
    );

    // On s’attend à ce que le backend renvoie { token: "nouveau_jwt" }
    return response.data.token;
  } catch (err) {
    if (err.response) {
      throw new Error(
        err.response.data.message || "Échec du rafraîchissement de token"
      );
    } else {
      throw new Error(
        "Impossible de joindre le serveur pour rafraîchir le token"
      );
    }
  }
}

/**
 * Envoie une requête POST vers /api/logout pour invalider le refresh token côté serveur.
 * À adapter si votre backend propose un endpoint de logout.
 * Si vous ne gérez pas d’invalidation côté serveur, vous pouvez simplement supprimer le JWT côté client.
 * @returns {Promise<void>}
 */
export async function logoutRequest() {
  try {
    await axios.post(
      "/api/logout",
      {},
      {
        withCredentials: true, // si votre backend utilise des cookies pour la session
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    // En cas d’échec du logout côté serveur, on ignore et on continue quand même
    console.warn("Échec de la requête de logout :", err);
  }
}

/**
 * Envoie une requête POST vers /api/forgot-password pour déclencher l’envoi
 * d’un e-mail de réinitialisation. Tant que l’API n’est pas disponible,
 * on pourra stubber ce endpoint côté backend ou renvoyer un simple message.
 * @param {{ email: string }} payload
 * @returns {Promise<string>} Message de confirmation (ex : “E-mail envoyé”)
 * @throws {Error} En cas d’erreur (400/500) ou d’indisponibilité
 */
export async function forgotPasswordRequest({ email }) {
  try {
    const response = await axios.post(
      "/api/forgot-password",
      { email },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // On suppose que le backend renvoie quelque chose comme :
    // { message: "Si l’adresse existe, vous allez recevoir un e-mail." }
    return response.data.message;
  } catch (err) {
    if (err.response) {
      throw new Error(
        err.response.data.message || "Erreur mot de passe oublié"
      );
    } else {
      throw new Error(
        "Impossible de joindre le serveur pour mot de passe oublié"
      );
    }
  }
}

export default {
  loginRequest,
  refreshTokenRequest,
  logoutRequest,
  forgotPasswordRequest,
};
