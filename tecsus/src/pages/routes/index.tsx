import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthenticatedRoutes from "./Authenticated";
import UnauthenticatedRoutes from "./nonAuthenticated";
import "../../global.css";

const AppRoutes: React.FC = () => {

  return (
    <Router>
        <AuthenticatedRoutes />
        <UnauthenticatedRoutes />
    </Router>
  );
};

export default AppRoutes;