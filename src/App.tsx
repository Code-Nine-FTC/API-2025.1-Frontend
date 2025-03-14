import { Box, ThemeProvider } from "@mui/material";
import AppRoutes from "@routes/routes";
import lightTheme from "./lightTheme";
import Sidebar from "@components/sidebar";

const drawerWidth = 260;

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <AppRoutes />
    </ThemeProvider>
  );
}
