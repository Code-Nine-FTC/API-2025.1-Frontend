import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "../Dashboard";
import ProtectedRoute from "../../components/ProtectedRoute";

const AuthenticatedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AuthenticatedRoutes;