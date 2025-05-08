// src/components/SideBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptIcon from "@mui/icons-material/Receipt";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

const drawerWidth = 240;

export default function SideBar() {
  const { pathname } = useLocation();
  const theme = useTheme();
  // Masque le drawer en xs / sm et le passe en temporaire
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const items = [
    { to: "/profil", icon: <PersonIcon />, label: "Mon profil" },
    {
      to: "/demande-document",
      icon: <DescriptionIcon />,
      label: "Demande docs",
    },
    {
      to: "/demande-conges",
      icon: <CalendarTodayIcon />,
      label: "Demande congés",
    },
    { to: "/fiches-paie", icon: <ReceiptIcon />, label: "Mes fiches" },
    {
      to: "/mot-de-passe-oublie",
      icon: <VpnKeyIcon />,
      label: "Modifier MD-P",
    },
  ];

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open
      onClose={() => {}}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#2c3e50",
          color: "#fff",
        },
      }}
    >
      <Toolbar />
      <List>
        {items.map(({ to, icon, label }) => (
          <ListItem
            button
            key={to}
            component={Link}
            to={to}
            selected={pathname === to}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#1a252f",
              },
              "&:hover": {
                backgroundColor: "#1a252f",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
