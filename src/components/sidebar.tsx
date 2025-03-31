import { useState } from "react";
import {
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
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SensorsIcon from "@mui/icons-material/Sensors";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TuneIcon from "@mui/icons-material/Tune";
import TecsusLogo from "../assets/tecsus_logo.svg";
import LogoutLogo from "../assets/logout_logo.svg";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../services/authContext";

const drawerWidth = 260;

const menuItems = [
  // { text: "Dashboard", icon: <BarChartIcon sx={{ fontSize: 40 }} />, route: "/dashboard" },
  {
    text: "Estações",
    icon: <SensorsIcon sx={{ width: 40, height: 40 }} />,
    relatedRoutes: ["/listarestacao", "/registrarestacao"],
    routePrefix: "/editarestacao/",
  },
  {
    text: "Tipo de Parâmetro",
    icon: <TuneIcon sx={{ fontSize: 40 }} />,
    relatedRoutes: ["/listartipoparametro","/registrarparametro",],
    routePrefix: "/editarparametrotipo/",
  },
  { text: "Alertas", icon: <NotificationImportantIcon sx={{ fontSize: 40 }} />, route: "/listalerts" },
  { text: "Tipo de Alertas", icon: <NotificationsActiveIcon sx={{ fontSize: 40 }} />, relatedRoutes:[ "/listartipoalerta", "/registrartipoalerta"],
  routePrefix: "/editartipoalerta/", },
];

interface Props {
  window?: () => Window;
}

const Sidebar = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("Adm"); 

  const { logout } = useAuth();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isProfileActive = location.pathname === "/perfil"; // Verifica se a rota atual é "/perfil"

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <img src={TecsusLogo} alt="Tecsus Logo" width="120px" />
      </Box>

      <Divider />

      {/* Menu */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          // Verifica se a rota atual está incluída no array relatedRoutes ou começa com o routePrefix
          const isActive =
            (item.relatedRoutes && item.relatedRoutes.includes(location.pathname)) ||
            (item.routePrefix && location.pathname.startsWith(item.routePrefix)) ||
            location.pathname === item.route;

          return (
            <ListItem key={item.text} disablePadding>
              {item.route || item.relatedRoutes ? (
                <ListItemButton
                  component={Link}
                  to={item.route || item.relatedRoutes?.[0] || ""}
                  sx={{
                    borderRadius: (theme) => theme.shape.borderRadius,
                    backgroundColor: isActive ? "#C1BEBE" : "transparent",
                    color: isActive ? "var(--purple-maincolor)" : "black",
                    "&:hover": {
                      backgroundColor: "#959595",
                      color: "black",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "var(--purple-maincolor)" : "gray",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      Typography: "h6",
                      textDecoration: "none",
                    }}
                  />
                </ListItemButton>
              ) : null}
            </ListItem>
          );
        })}
      </List>

      {/* Usuário */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "#D0D0D0",
          borderRadius: 2,
          mx: 1,
          mb: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link to="/perfil" className="image-link">
          <ListItemIcon
            sx={{
              color: isProfileActive ? "purple" : "gray", // Ícone roxo se ativo
              "&:hover": {
                color: "purple", // Ícone roxo ao passar o mouse
              },
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </ListItemIcon>
        </Link>
        <Typography
          variant="body1"
          fontWeight="bold"
          fontSize="1.1em"
          sx={{
            color: isProfileActive ? "purple" : "black", // Texto roxo se ativo
          }}
        >
          {userName}
        </Typography>
        <ListItemIcon sx={{ ml: 9 }}>
          <Box
            onClick={logout}
            className="image-link"
            sx={{
              cursor: "pointer",
            }}
          >
            <img src={LogoutLogo} alt="Logout Logo" width="60%" />
          </Box>
        </ListItemIcon>
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <IconButton
        color="inherit"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ marginLeft: "1%" }}
      >
        <MenuIcon sx={{ color: "black", display: { xs: "block", md: "none" } }} />
      </IconButton>

      {/* Drawer para telas grandes */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "transparent",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          },
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
          "& .MuiDrawer-paper": { width: drawerWidth },
          boxSizing: "border-box",
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
