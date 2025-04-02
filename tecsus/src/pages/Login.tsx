import React, { useState } from "react";
import { Box, TextField, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    // Simulação de login (substitua pela lógica real)
    if (email === "admin@example.com" && password === "password") {
      navigate("/listarestacao");
    } else {
      setErrorLogin("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="login-page">
      <Container maxWidth="xs" className="container">
        <Box
          component="form"
          className="login-box"
          onSubmit={handleLogin}
          noValidate
        >
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
            required
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
            required
          />

          {errorLogin && (
            <p style={{ color: "red", margin: "8px 0" }}>{errorLogin}</p>
          )}

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