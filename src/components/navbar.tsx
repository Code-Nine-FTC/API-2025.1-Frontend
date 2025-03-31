import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: "none", borderBottom: "1px solid #ccc" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <img 
          src="src/assets/tecsus_logo.svg" 
          alt="Logo-Tecsus" 
          style={{ width: "120px", height: "auto", cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
        
        <Box>
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
            sx={{ color: location.pathname === "/vejamais" ? "purple" : "black", fontWeight: "bold" }} 
            onClick={() => navigate("/vejamais")}
          >
            Veja Mais
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;