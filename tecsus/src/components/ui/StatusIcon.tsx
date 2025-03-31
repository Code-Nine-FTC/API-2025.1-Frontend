import React from "react";
import { Box } from "@mui/material";

interface StatusIconProps {
  status: "R" | "G" | "Y" | "D";
  size?: number;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, size = 24 }) => {
  // Define as cores com base no status
  const getColor = (status: string) => {
    switch (status) {
      case "R":
        return "red";
      case "G":
        return "green";
      case "Y":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: getColor(status),
        display: "inline-block",
      }}
    />
  );
};

export default StatusIcon;