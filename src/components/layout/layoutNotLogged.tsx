import { ReactNode } from "react";
import { Link } from "react-router-dom";
import {Box} from "@mui/material";
import Navbar from "@components/navbar";

interface LayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: LayoutProps) {
  return (
    <Box >
        <Navbar />   
        <Box flex={1}>
          {children}
        </Box>
    </Box>
  );
};