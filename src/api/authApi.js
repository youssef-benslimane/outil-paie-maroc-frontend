// src/api/authApi.js
export async function login({ username, password }) {
  const resp = await fetch("http://localhost:8080/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `Erreur ${resp.status}`);
  }

  const data = await resp.json();
  // data doit contenir au moins { token: "...", user: { … } }
  return data;
}
