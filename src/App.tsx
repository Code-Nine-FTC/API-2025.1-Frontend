import { Box, ThemeProvider } from "@mui/material";
import AppRoutes from "@routes/routes";
import lightTheme from "./lightTheme";
import Sidebar from "@components/sidebar";
import { AuthProvider } from "../src/services/authContext";

const drawerWidth = 260;

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
