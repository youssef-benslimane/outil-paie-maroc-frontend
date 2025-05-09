// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
 
// Crée le contexte d’authentification
export const AuthContext = createContext();
 
export function AuthProvider({ children }) {
  // Récupère token et user en localStorage (user peut être null)
  const [token, setToken] = useState(localStorage.getItem("token"));
  let savedUser = null;
  try {
    savedUser = JSON.parse(localStorage.getItem("user"));
  } catch {
    savedUser = null;
  }
  const [user, setUser] = useState(savedUser);
 
  // Connexion : on stocke en localStorage et on met à jour le state
  const login = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };
 
  // Déconnexion : on efface tout
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };
 
  return (
<AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
</AuthContext.Provider>
  );
}
 
// Hook pour l’accès au contexte
export const useAuth = () => useContext(AuthContext);