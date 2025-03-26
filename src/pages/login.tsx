import * as React from "react";
import { Box, TextField, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./styles/login.css";
import { links } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await links.login(email, password);
      if (response.success) {
        localStorage.setItem("access_token", response.token || "");
        navigate("/teste");
      } else {
        setError(response.error || "Erro ao fazer login");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor");
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
            onFocus={() => setError("")}
          />

          <TextField
            fullWidth
            id="password"
            label="Senha"
            type="password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setError("")}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

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