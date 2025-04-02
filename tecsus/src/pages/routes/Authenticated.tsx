import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "../Dashboard";
import ProtectedRoute from "../../components/ProtectedRoute";
import StationPage from "../Station";

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
      <Route
        path="/listarestacao"
        element={
          <ProtectedRoute>
            <StationPage />
          </ProtectedRoute>
        }></Route>
    </Routes>
  );
};

export default AuthenticatedRoutes;