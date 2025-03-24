import { ReactNode } from "react";
import { Link } from "react-router-dom";
import {Box} from "@mui/material";
import Sidebar from "@components/sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: LayoutProps) {
  return (
    <Box >
        <Sidebar />     
        <Box flex={1}>
          {children}
        </Box>
    </Box>
  );
};

