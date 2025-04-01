import React from "react";
import { AppBar, Toolbar, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import TecsusLogo from '../assets/tecsus_logo.svg'; 

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: "none", borderBottom: "1px solid #ccc" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <img
          src={TecsusLogo}
          alt="Logo-Tecsus"
          style={{ width: "120px", height: "auto", cursor: "pointer" }}
          onClick={() => navigate("/")}
        />

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: "20px" }}>
          <Button
            sx={{ color: location.pathname === "/about" ? "purple" : "black", fontWeight: "bold" }}
            onClick={() => navigate("/about")}
          >
            Sobre nós
          </Button>
          <Button
            sx={{ color: location.pathname === "/educacao" ? "purple" : "black", fontWeight: "bold" }}
            onClick={() => navigate("/educacao")}
          >
            Educacional
          </Button>
          <Button
            sx={{ color: location.pathname === "/listagem-combinada" ? "purple" : "black", fontWeight: "bold" }}
            onClick={() => navigate("/listagem-combinada")}
          >
            Listagem Estação/Alerta
          </Button>
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate("/about"); }}>
              Sobre nós
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/educacao"); }}>
              Educacional
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/listagem-combinada"); }}>
              Listagem Estação/Alerta
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;