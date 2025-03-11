import { ThemeProvider } from "@mui/material";
import AppRoutes from "@routes/routes";
import lightTheme from "./lightTheme";

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <AppRoutes />
    </ThemeProvider>
  );
}
