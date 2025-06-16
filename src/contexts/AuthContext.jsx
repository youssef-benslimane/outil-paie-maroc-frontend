// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

import axios from "axios";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  // Au démarrage, on restaure depuis localStorage ou sessionStorage

  useEffect(() => {
    const savedToken =
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");

    const savedUser =
      localStorage.getItem("loggedUser") ||
      sessionStorage.getItem("loggedUser");

    if (savedToken && savedUser) {
      setToken(savedToken);

      setUser(JSON.parse(savedUser));

      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, []);

  function login(jwt, userObj, remember) {
    setToken(jwt);

    setUser(userObj);

    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

    const storage = remember ? localStorage : sessionStorage;

    storage.setItem("jwtToken", jwt);

    storage.setItem("loggedUser", JSON.stringify(userObj));
  }

  function logout() {
    setToken(null);

    setUser(null);

    delete axios.defaults.headers.common["Authorization"];

    localStorage.removeItem("jwtToken");

    localStorage.removeItem("loggedUser");

    sessionStorage.removeItem("jwtToken");

    sessionStorage.removeItem("loggedUser");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
