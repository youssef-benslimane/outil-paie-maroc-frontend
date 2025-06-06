// src/pages/GestionUtilisateursPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Toolbar,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TextField,
  Stack,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SearchIcon from "@mui/icons-material/Search";
import AdministrateurSidebar from "../components/AdministrateurSidebar.jsx";
import CreateUserDialog from "../components/CreateUserDialog.jsx";
import EditUserDialog from "../components/EditUserDialog.jsx";
import ResetPasswordDialog from "../components/ResetPasswordDialog.jsx";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
} from "../api/fakeUserApi.js";

const drawerWidth = 240;

export default function GestionUtilisateursPage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();

  // États pour les données utilisateurs et la recherche
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // États pour les Snackbars
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success",
  });
  const showSnack = (msg, severity = "success") =>
    setSnack({ open: true, msg, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // États pour les Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetId, setResetId] = useState(null);

  // Charger la liste des utilisateurs
  const fetchUsers = useCallback(async () => {
    const all = await getAllUsers();
    setUsers(all);
  }, []);

  useEffect(() => {
    fetchUsers();
    window.history.replaceState({}, "");
  }, [fetchUsers]);

  // Filtrage en fonction du champ de recherche
  const filteredUsers = users.filter((u) =>
    [u.prenom, u.nom, u.emailPro, u.matricule, u.role]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Gestion des actions CRUD
  const onCreated = useCallback(() => {
    fetchUsers();
    showSnack("Utilisateur créé avec succès");
  }, [fetchUsers]);

  const onUpdated = useCallback(() => {
    fetchUsers();
    showSnack("Informations utilisateur mises à jour");
  }, [fetchUsers]);

  const confirmDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
    showSnack("Utilisateur supprimé", "info");
  };

  const handleResetClick = async (id) => {
    setResetId(id);
    setResetOpen(true);
  };

  const confirmReset = async (newPassword) => {
    if (!resetId) return;
    await resetUserPassword(resetId, newPassword);
    setResetOpen(false);
    showSnack("Mot de passe réinitialisé");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdministrateurSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${drawerWidth}px` },
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Gestion des utilisateurs
          </Typography>

          {/* Barre de recherche + bouton Créer */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMdUp ? "row" : "column",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: isMdUp ? "auto" : "100%",
                justifyContent: isMdUp ? "flex-start" : "flex-start",
              }}
            >
              <SearchIcon />
              <TextField
                size="small"
                placeholder="Rechercher…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: isMdUp ? 300 : "100%" }}
              />
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateOpen(true)}
            >
              Ajouter utilisateur
            </Button>
          </Box>

          {/* Tableau des utilisateurs */}
          <Paper>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Prénom</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Email professionnel</TableCell>
                    <TableCell>Matricule interne</TableCell>
                    <TableCell>Rôle attribué</TableCell>
                    <TableCell>État du compte</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.prenom}</TableCell>
                      <TableCell>{user.nom}</TableCell>
                      <TableCell>{user.emailPro}</TableCell>
                      <TableCell>{user.matricule}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {user.actif ? "Actif" : "Désactivé"}
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditId(user.id);
                              setEditOpen(true);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => confirmDelete(user.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleResetClick(user.id)}
                          >
                            <VpnKeyIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Dialogs */}
      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />
      <EditUserDialog
        open={editOpen}
        id={editId}
        onClose={() => setEditOpen(false)}
        onUpdated={onUpdated}
      />
      <ResetPasswordDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onReset={confirmReset}
      />

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
