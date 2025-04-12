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
          bgcolor: "#f5f5f5",
          flex: 1,
          height: "100vh",
          width: "100vw",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};