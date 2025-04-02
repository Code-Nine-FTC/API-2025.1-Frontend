import * as React from "react";
import { Box, TextField, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./styles/login.css";
import { links } from "../services/api";
import { useAuth } from "../services/authContext"

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  
  const { login, isAuthenticated, loading, error, clearError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/listarestacao");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

      const response = await login(email, password);

      if (response) {
        navigate("/listarestacao");
      }
    };

  return (
    <div className="login-page">
      <Container maxWidth="xs" className="container">
        <Box component="form" className="login-box" onSubmit={handleLogin}>
          <img src="src/assets/tecsus_logo.svg" alt="Logo" />

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