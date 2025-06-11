import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import RhSidebar from "../components/RhSidebar.jsx";

export default function EnvoiBulletinsPage() {
  const [bulletins, setBulletins] = useState([
    {
      id: 1,
      matricule: "M12345",
      nom: "Dupont",
      prenom: "Marie",
      contrat: "CDI",
      url: "/bulletins/1.pdf",
      mois: "Mai 2025",
    },
  ]);
  useEffect(() => {
    axios
      .get("/api/bulletins")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.content || [];
        if (list.length) setBulletins(list);
      })
      .catch(console.error);
  }, []);

  const handleView = (url) => {
    window.open(url, "_blank");
  };

  const handleSendAll = () => {
    axios
      .post("/api/bulletins/send")
      .then(() => alert("Envoi automatique lancé"))
      .catch(console.error);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <RhSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="lg">
          <Typography variant="h5" align="center" gutterBottom>
            Envoi des bulletins
          </Typography>

          <Typography variant="h6" gutterBottom>
            Visualisation des fiches
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Matricule</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Contrat</TableCell>
                  <TableCell>Mois</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bulletins.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.matricule}</TableCell>
                    <TableCell>{b.nom}</TableCell>
                    <TableCell>{b.prenom}</TableCell>
                    <TableCell>{b.contrat}</TableCell>
                    <TableCell>{b.mois}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleView(b.url)}
                      >
                        Voir bulletin
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" onClick={handleSendAll}>
              Envoi automatique aux salariés
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
