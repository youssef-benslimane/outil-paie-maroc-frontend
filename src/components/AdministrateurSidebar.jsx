// src/components/AdministrateurSidebar.jsx
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
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";

const drawerWidth = 240;
const items = [
  { to: "/admin", icon: <HomeIcon />, label: "Accueil" },
  {
    to: "/admin/gestion-users",
    icon: <PeopleIcon />,
    label: "Gestion des utilisateurs",
  },
  {
    to: "/admin/journal-activite",
    icon: <HistoryIcon />,
    label: "Journal d'activité",
  },
  {
    to: "/admin/parametres-systeme",
    icon: <SettingsIcon />,
    label: "Paramètres du système",
  },
  {
    to: "/admin/tableau-bord",
    icon: <DashboardIcon />,
    label: "Tableau de bord global",
  },
  {
    to: "/admin/base-donnees",
    icon: <StorageIcon />,
    label: "Base de données",
  },
];

export default function AdministrateurSidebar() {
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
              Menu
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
