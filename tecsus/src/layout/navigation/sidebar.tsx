import { useEffect, useState } from "react";
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
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SensorsIcon from "@mui/icons-material/Sensors";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TuneIcon from "@mui/icons-material/Tune";
import TecsusLogo from "../../assets/tecsus_logo.png";
import AppIcon from "../../components/ui/AppIcon";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/authContext";
import userStore from "../../store/profile/getters";

const drawerWidth = 260;

const menuItems = [
  {
    text: "Estações",
    icon: <SensorsIcon sx={{ width: 40, height: 40 }} />,
    route: "/list-station",
    relatedRoutes: ["/list-station", "/register-station"],
    routePrefix: "/editarestacao/",
  },
  {
    text: "Tipo de Parâmetro",
    icon: <TuneIcon sx={{ fontSize: 40 }} />,
    relatedRoutes: [
      "/list-parameter-type", 
      "/registrarparametro"
    ],
    routePrefix: "/editarparametrotipo/",
  },
  { text: "Alertas", 
    icon: <NotificationImportantIcon sx={{ fontSize: 40 }} />, 
    route: "/list-alerts" 
  },
  { text: "Tipo de Alertas", 
    icon: <NotificationsActiveIcon sx={{ fontSize: 40 }} />, 
    relatedRoutes:[ 
      "/list-alert-type", 
      "/registrartipoalerta"
    ],
    routePrefix: "/editartipoalerta/", },
];

interface Props {
  window?: () => Window;
}

const Sidebar = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");

  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isProfileActive = location.pathname === "/perfil";

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const fetchUserData = async () => {
    try {
      const profile = await userStore.getProfile();
      setUserName(profile.name);
    } catch (error) {
      console.error("Erro ao carregar informações do usuário:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <img src={TecsusLogo} alt="Tecsus Logo" width="120px" />
      </Box>

      <Divider />

      {/* Menu */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
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
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: "#BDBDBD",
            cursor: "pointer",
            border: isProfileActive ? "2px solid var(--purple-maincolor)" : "2px solid gray",
            "&:hover": {
              borderColor: "var(--purple-maincolor)",
            },
          }}
          onClick={() => navigate("/perfil")}
        />
        <Typography
          variant="body1"
          fontWeight="bold"
          fontSize="1.1em"
          sx={{
            color: isProfileActive ? "var(--purple-maincolor)" : "black",
            ml: 1,
            cursor: "pointer",
            "&:hover": {
              color: "var(--purple-maincolor)",
            },
          }}
          onClick={() => navigate("/perfil")}
        >
          {userName || "Carregando..."}
        </Typography>
        <ListItemIcon sx={{ ml: 9 }}>
          <Box
            onClick={logout}
            className="image-link"
            sx={{
              cursor: "pointer",
            }}
          >
            <AppIcon name="Logout" style={{ fontSize: 30, color: "black" }} />
          </Box>
        </ListItemIcon>
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Ícone de menu (hambúrguer) no canto superior esquerdo */}
      <IconButton
        color="inherit"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          position: "absolute", // Fixa o ícone na posição desejada
          top: 16, // Ajuste a distância do topo
          left: 16, // Ajuste a distância da esquerda
          zIndex: 1300, // Garante que o ícone fique acima de outros elementos
          display: { xs: "block", md: "none" }, // Mostra apenas em telas pequenas
        }}
      >
        <MenuIcon sx={{ color: "black" }} />
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
          display: { xs: "fixed", md: "none" },
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