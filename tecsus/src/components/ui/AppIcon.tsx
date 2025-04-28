import React from "react";
import * as Icons from "@mui/icons-material";
import { SvgIconProps } from "@mui/material/SvgIcon";

interface AppIconProps extends SvgIconProps {
  name: string;
}

const AppIcon: React.FC<AppIconProps> = ({ name, ...props }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    console.warn(`O ícone "${name}" não foi encontrado em @mui/icons-material.`);
    return null;
  }

  return <IconComponent {...props} />;
};

export default AppIcon;