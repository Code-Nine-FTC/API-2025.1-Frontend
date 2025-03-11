import { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";

const drawerWidth = 260;

const menuItems = [
  { text: "Home", icon: <HomeIcon /> },
  { text: "Educação", icon: <SchoolIcon /> },
  { text: "Estações", icon: <SignalCellularAltIcon /> },
  { text: "DashBoard", icon: <BarChartIcon /> },
  { text: "Alertas", icon: <NotificationsActiveIcon /> },
];

interface Props {
  window?: () => Window;
}

const Sidebar = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState("Home");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#F8F8F8" }}>
      {/* Logo */}
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <img src="/logo.png" alt="Logo" width="120px" />
      </Box>

      <Divider />

      {/* Menu */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={selected === item.text}
              onClick={() => setSelected(item.text)}
              sx={{
                "&.Mui-selected": { backgroundColor: "#D0D0D0", "& .MuiListItemIcon-root": { color: "blueviolet" } },
                "&:hover": { backgroundColor: "#E0E0E0" },
                borderRadius: 2,
                mx: 1,
              }}
            >
              <ListItemIcon sx={{ color: selected === item.text ? "blueviolet" : "gray" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ color: selected === item.text ? "blueviolet" : "black" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Usuário */}
      <Box sx={{ p: 2, backgroundColor: "#D0D0D0", borderRadius: 2, mx: 1, mb: 2, display: "flex", alignItems: "center" }}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <Typography variant="body1" fontWeight="bold">
          Pedro
        </Typography>
        <ListItemIcon sx={{ ml: "auto" }}>
          <AssignmentIcon />
        </ListItemIcon>
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar para mobile */}
      <AppBar position="fixed" sx={{ display: { md: "none" }, backgroundColor: "white", boxShadow: "none" }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon sx={{ color: "black" }} />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "black" }}>
            Tecsus
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer para telas grandes */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Drawer para mobile */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
