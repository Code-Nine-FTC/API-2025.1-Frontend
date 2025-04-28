import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./navigation/sidebar";

export const LoggedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: "flex" }} >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: "100vh",
          width: "100vw",
          bgcolor: "#f5f5f5",
          py: 5,
          flexGrow: 1
        }}
      >
        {children}
      </Box>
    </Box>
  );
};