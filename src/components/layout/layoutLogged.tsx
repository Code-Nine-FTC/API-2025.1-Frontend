import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../sidebar";

export const LoggedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, my: 5 }}>
        {children}
      </Box>
    </Box>
  );
};
