// src/components/ConfigurateurSidebar.jsx
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
import BusinessIcon from "@mui/icons-material/Business";
import BarChartIcon from "@mui/icons-material/BarChart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PercentIcon from "@mui/icons-material/Percent";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import LayersIcon from "@mui/icons-material/Layers";

const drawerWidth = 240;
const items = [
  { to: "/configurateur", icon: <HomeIcon />, label: "Accueil" },
  {
    to: "/configurateur/param-admin",
    icon: <BusinessIcon />,
    label: "Paramétrage des données administratives",
  },
  {
    to: "/configurateur/param-cotisations",
    icon: <AttachMoneyIcon />,
    label: "Paramétrage des cotisations",
  },
  {
    to: "/configurateur/param-absence",
    icon: <BeachAccessIcon />,
    label: "Paramétrage des absences",
  },
  {
    to: "/configurateur/param-prime",
    icon: <EmojiEventsIcon />,
    label: "Paramétrage des primes et indemnités",
  },
  {
    to: "/configurateur/param-bareme-ir",
    icon: <PercentIcon />,
    label: "Paramétrage barème IR",
  },
  {
    to: "/configurateur/param-temps",
    icon: <AccessTimeIcon />,
    label: "Paramétrage des données temps",
  },
  {
    to: "/configurateur/param-motif-mesure",
    icon: <PlaylistAddCheckIcon />,
    label: "Paramétrage des mesures et motifs",
  },
  {
    to: "/configurateur/param-etat",
    icon: <BarChartIcon />,
    label: "Paramétrage des états",
  },
  {
    to: "/configurateur/param-profil-grille",
    icon: <LayersIcon />,
    label: "Paramétrage des profils et grilles salariales",
  },
];

export default function ConfigurateurSidebar() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // contenu commun au drawer
  const drawerContent = (
    <Box sx={{ height: "100vh", overflowY: "auto" }}>
      <Toolbar />
      <List>
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
