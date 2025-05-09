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

import { loginApi } from "../api/authApi";

import { useAuth } from "../contexts/AuthContext";
 
export default function LoginPage() {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);

  const [error, setError] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
 
    try {

      // 1) Appel auth

      const { token } = await loginApi({ username, password });
 
      // 2) Stockage du token (et éventuellement user plus tard)

      login(token, null, remember);
 
      // 3) Redirection vers la page configurateur (pour tester l’auth uniquement)

      navigate("/configurateur");

    } catch (err) {

      setError(

        err.response?.data?.message ||

        err.message ||

        "Erreur d'authentification"

      );

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

            label="Nom d'utilisateur"

            fullWidth

            required

            margin="normal"

            value={username}

            onChange={(e) => setUsername(e.target.value)}

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

              justifyContent: "space-between",

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
<Button

            type="submit"

            variant="contained"

            fullWidth

            sx={{ mt: 3 }}
>

            Se connecter
</Button>
</Box>
</Container>
</Box>

  );

}

 