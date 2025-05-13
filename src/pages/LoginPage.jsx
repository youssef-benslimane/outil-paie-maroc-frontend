// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Alert,
  Link,
} from "@mui/material";
import { fakeLogin } from "../api/fakeAuthApi.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Appel à fakeLogin
      const { token, user } = await fakeLogin({ email, password });

      // Stocke le token et l'utilisateur
      login(token, user);

      // Redirection selon le rôle
      switch (user.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "RH":
          navigate("/rh");
          break;
        case "EMPLOYE":
          navigate("/employe");
          break;
        case "CONFIGURATEUR":
          navigate("/configurateur");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Erreur d'authentification");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography variant="h5" align="center" gutterBottom>
          Connexion
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Adresse e-mail"
            fullWidth
            required
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
            }
            label="Se souvenir de moi"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Link
              component={RouterLink}
              to="/mot-de-passe-oublie"
              variant="body2"
            >
              Mot de passe oublié ?
            </Link>
          </Box>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Se connecter
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
