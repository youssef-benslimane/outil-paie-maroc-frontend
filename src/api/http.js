import { getToken } from "../contexts/AuthContext";
// (éventuellement exporter une fonction getToken() depuis ton AuthContext)

export async function http(path, options = {}) {
  const token = getToken(); // récupère le token depuis le contexte ou localStorage
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const resp = await fetch(path, { headers, ...options });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}
