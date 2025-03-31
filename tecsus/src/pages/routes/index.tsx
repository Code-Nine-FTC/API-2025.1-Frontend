import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthenticatedRoutes from "./Authenticated";
import UnauthenticatedRoutes from "./nonAuthenticated";

const AppRoutes: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      {isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </Router>
  );
};

export default AppRoutes;