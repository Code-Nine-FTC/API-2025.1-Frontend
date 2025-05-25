import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./config/theme";
import AppRoutes from "./pages/routes/index";
import { AuthProvider } from "./components/authContext";
import { BrowserRouter } from "react-router-dom";
import Highcharts from 'highcharts/highstock';
import 'highcharts/highcharts-more';
import 'highcharts/modules/solid-gauge';

Highcharts.setOptions({
  lang: {
    months: [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ],
    shortMonths: [
      'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
      'jul', 'ago', 'set', 'out', 'nov', 'dez'
    ],
    weekdays: [
      'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
      'quinta-feira', 'sexta-feira', 'sábado'
    ],
    thousandsSep: '.',
    decimalPoint: ',',
    locale: 'pt-BR',
    loading: 'Carregando...',
    resetZoom: 'Redefinir zoom',
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);