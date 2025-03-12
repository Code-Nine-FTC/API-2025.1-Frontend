import { Box, ThemeProvider } from "@mui/material";
import AppRoutes from "@routes/routes";
import lightTheme from "./lightTheme";
import Sidebar from "@components/sidebar";

const drawerWidth = 260;

export default function App() {
  return (
      <ThemeProvider theme={lightTheme}>
        {/* <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box 
            component="main" 
            // sx={{ 
            //   flexGrow: 1, 
            //   p: 3, 
            //   marginLeft: { xs: 0, md: `${drawerWidth}px` },
            //   width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` }
            // }}
          >
            
          </Box>
        </Box> */
        <AppRoutes />}
      </ThemeProvider>
  );
}
