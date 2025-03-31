import React from "react";
import { Button, Typography, Container } from "@mui/material";
import AppIcon from "./components/ui/AppIcon";

const App: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao React com Vite, TypeScript e Material-UI!
      </Typography>
      <Button variant="contained" color="primary">
        Clique Aqui
      </Button>
      <AppIcon name="Home" style={{ fontSize: 40, color: "blue" }} /> 
      <AppIcon name="Settings" style={{ fontSize: 40, color: "green" }} />
      <AppIcon name="Search" style={{ fontSize: 40, color: "red" }} />
      Exemplo de Uso de Icones
    </Container>
  );
};
// https://mui.com/material-ui/material-icons/?srsltid=AfmBOopwExhwm38L_9h5UbYcEHg6HzGPVjEibjZ3YWe_ne3uUV5JOCct Onde pegar os Icones
export default App;