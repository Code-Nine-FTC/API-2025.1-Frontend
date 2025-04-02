import { ReactNode } from "react";
import {Box} from "@mui/material";
import Navbar from "./navigation/navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: LayoutProps) {
  return (
    <Box sx={{backgroundColor:"#f3eeee"}}>
        <Navbar />   
        <Box flex={1}
          sx={{backgroundColor: "#f3eeee", minHeight: "100vh"}}>
          {children}
        </Box>
    </Box>
  );
};