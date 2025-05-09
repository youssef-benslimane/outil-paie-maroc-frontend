import axios from "axios";
 
const base = "http://localhost:8080";  

 
// On injecte automatiquement le JWT si présent

axios.interceptors.request.use((cfg) => {

  const token = localStorage.getItem("token");

  if (token) cfg.headers.Authorization = `Bearer ${token}`;

  return cfg;

});
 
export async function loginApi({ username, password }) {

  // Appel à POST /api/login

  const { data } = await axios.post(

    `${base}/api/login`,

    { username, password }

  );

  // On s’attend à recevoir au moins { token: "..." }

  // et, idéalement, un user : { id, role, nom, prenom, ... }

  return data;

}
 
// Si besoin de récupérer le profil après le login

export async function fetchProfile() {

  const { data } = await axios.get(`${base}/api/profile`);

  return data;

}

 