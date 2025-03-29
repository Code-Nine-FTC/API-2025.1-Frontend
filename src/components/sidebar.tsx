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
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TecsusLogo from "../assets/tecsus_logo.svg";
import StationLogo from "../assets/station_logo.svg";
import LogoutLogo from '../assets/logout_logo.svg';
import { Link } from "react-router-dom";
import { useAuth } from "../services/authContext"

const drawerWidth = 260;

const menuItems = [
  { text: "Home", icon: <HomeIcon sx={{fontSize: 40}}/>, route: "/" },
  { text: "Educação", icon: <SchoolIcon sx={{fontSize: 40}} />, route: "/educacao"  },
  { text: "Estações", icon: <img src={StationLogo}/>, route: "/listarestacao" },
  { text: "Dashboard", icon: <BarChartIcon sx={{fontSize: 40}} />, route: "/dashboard"  },
  { text: "Alertas", icon: <NotificationsActiveIcon sx={{fontSize: 40}} />, route: "/alertas"  },
];

interface Props {
  window?: () => Window;
}

const Sidebar = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState("Home");
  const [userName, setUserName] = useState("Pedro");

  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh"}}>
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <img src={TecsusLogo} alt="Tecsus Logo" width="120px" />
      </Box>

      <Divider />

      {/* Menu */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding 
          sx={{
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
              color: "black",
            },
          }}>
            <ListItemButton
              selected={selected === item.text}
              onClick={() => setSelected(item.text)}
              component={Link} 
              to={item.route}
              sx={{
                borderRadius: (theme) => theme.shape.borderRadius,
                "&:hover": {
                  backgroundColor: "#959595",
                  color: "black", 
                },
                "&.Mui-selected": {
                  backgroundColor: "#C1BEBE",
                  color: "var(--purple-maincolor)",
                  "& .MuiListItemIcon-root": {
                    color: "var(--purple-maincolor)",
                  },
                },
              }}
            >
              <ListItemIcon>
                {item.text === "Estações" ? (
                  <img src={StationLogo}
                  alt="Station Logo"
                  className={selected === "Estações" ? "image-link" : ""}
                  style={{width: 40, height: 40 }}
                />
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} 
                sx={{ 
                  Typography: 'h6', textDecoration: "none",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Usuário */}
      <Box sx={{ p: 2, backgroundColor: "#D0D0D0", borderRadius: 2, mx: 1, mb: 2, display: "flex", alignItems: "center" }}>
        <Link to="/perfil" className="image-link">
          <ListItemIcon>
            <AccountCircleIcon sx={{fontSize: 40}}/>
          </ListItemIcon>
        </Link>
        <Typography variant="body1" fontWeight="bold" fontSize="1.1em">
          {userName}
        </Typography>
        <ListItemIcon sx={{ ml: 9}}>
          <Box onClick={logout} className="image-link">
            <img src={LogoutLogo} alt="Logout Logo" width="60%"/>
          </Box>
        </ListItemIcon>
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} 
            sx={{ marginLeft: "1%"}}>
          <MenuIcon sx={{ color: "black", display: { xs: "block", md: "none" }}} />
        </IconButton>

      {/* Drawer para telas grandes */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, 
          boxSizing: "border-box" ,
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
          "& .MuiDrawer-paper": { width: drawerWidth}, 
          boxSizing: "border-box",
          // backgroundColor: "transparent"},
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
