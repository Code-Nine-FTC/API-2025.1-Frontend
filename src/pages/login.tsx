import * as React from "react";
import { Box, TextField, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./styles/login.css";
import {links} from "../api/api"

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault(); 

    const fakeUser = {
      email: "admin@email.com",
      password: "123456",
    };

    event.preventDefault();

    // try {
    //   const response = await links.loginAuthenticate(email, password);
    //   console.log("Login Bem sucedido: ", response);

    //   // Armazenando o token ou qualquer dado de autenticação (opcional)
    //   // Você pode armazenar o token no localStorage, cookies ou contexto global
    //   localStorage.setItem("authToken", response.token); // Exemplo de como armazenar um token no localStorage

    //   // Redirecionando para a página principal após login bem-sucedido
    //   navigate("/dashboard"); // Redireciona para a página desejada após o login

    if (email === fakeUser.email && password === fakeUser.password) {
      navigate("/teste"); 
    } else {
      setError("O email ou senha estão incorretos"); 
      setEmail("");
      setPassword("");
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
