// src/components/RhSidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  useTheme,
  useMediaQuery,
  AppBar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";
import FunctionsIcon from "@mui/icons-material/Functions";
import SendIcon from "@mui/icons-material/Send";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const drawerWidth = 240;
const items = [
  { to: "/rh", icon: <HomeIcon />, label: "Accueil" },
  {
    to: "/rh/recherche-salarie",
    icon: <SearchIcon />,
    label: "Recherche Salarié",
  },
  {
    to: "/rh/elements-variables",
    icon: <DescriptionIcon />,
    label: "Éléments variables de paie",
  },
  {
    to: "/rh/calcul-paie",
    icon: <FunctionsIcon />,
    label: "Calcul de la paie",
  },
  {
    to: "/rh/envoi-bulletins",
    icon: <SendIcon />,
    label: "Envoi des bulletins",
  },
  {
    to: "/rh/gestion-admin-salaries",
    icon: <PeopleIcon />,
    label: "Gestion admin des salariés",
  },
  {
    to: "/rh/chargement-primes-retenues",
    icon: <AttachMoneyIcon />,
    label: "Chargement Primes/Retenues",
  },
  {
    to: "/rh/chargement-absences",
    icon: <BeachAccessIcon />,
    label: "Chargement des Absences",
  },
  {
    to: "/rh/validation-conges",
    icon: <CheckCircleIcon />,
    label: "Validation des demandes de congés payés",
  },
  {
    to: "/rh/declaration-sociales",
    icon: <AssessmentIcon />,
    label: "Déclaration Sociales",
  },
  {
    to: "/rh/periode-paie",
    icon: <CalendarTodayIcon />,
    label: "Période de paie",
  },
];

export default function RhSidebar() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#2c3e50",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar />
      <List
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {items.map(({ to, icon, label }) => (
          <ListItem key={to} disablePadding>
            <ListItemButton
              component={Link}
              to={to}
              selected={pathname === to}
              sx={{
                color: "#fff",
                "&.Mui-selected": {
                  bgcolor: "#1a252f",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* AppBar mobile */}
      {!isMdUp && (
        <AppBar
          position="fixed"
          sx={{ background: "#2c3e50", zIndex: theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Menu RH
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer mobile */}
      {!isMdUp && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#2c3e50",
              color: "#fff",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer permanent */}
      {isMdUp && (
        <Drawer
          variant="permanent"
          open
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#2c3e50",
              color: "#fff",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
