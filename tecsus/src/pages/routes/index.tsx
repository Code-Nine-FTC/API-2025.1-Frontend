import React from "react";
import AuthenticatedRoutes from "./Authenticated";
import UnauthenticatedRoutes from "./nonAuthenticated";
import "../../global.css";

const AppRoutes: React.FC = () => {

  return (
      <>
        <AuthenticatedRoutes />
        <UnauthenticatedRoutes />
      </>
  );
};

export default AppRoutes;