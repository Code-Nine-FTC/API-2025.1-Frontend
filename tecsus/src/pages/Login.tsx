import * as React from "react";
import { Box, TextField, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./styles/login.css";
import { useAuth } from "../components/authContext";
import userGetters from "../store/user/getters";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

      const response = await userGetters.login(email, password);
      
      if (response.success) {
        console.log("logou")
        navigate("/dashboard"); 
      }
    };

  return (
    <div className="login-page">
      <Container maxWidth="xs" className="container">
        <Box component="form" className="login-box" onSubmit={handleLogin}>
          <img src="src/assets/tecsus_logo.png" alt="Logo" />

          <TextField
            fullWidth
            id="email"
            label="Email"
            variant="filled"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setErrorLogin("")}
          />

          <TextField
            fullWidth
            id="password"
            label="Senha"
            type="password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setErrorLogin("")}
          />

          {errorLogin && <p style={{ color: "red" }}>{errorLogin}</p>}

          <Button
            fullWidth
            variant="contained"
            className="login-button"
            sx={{
              color: "white",
              backgroundColor: "var(--green-maincolor)",
              "&:hover": { backgroundColor: "var(--green-maincolorhover)" },
            }}
            type="submit"
          >
            Entrar
          </Button>
        </Box>
      </Container>
    </div>
  );
}