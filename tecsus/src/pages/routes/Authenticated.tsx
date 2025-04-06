import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "../Dashboard";
import ProtectedRoute from "../../components/ProtectedRoute";
import StationPage from "../Station";
import TypeAlertsPage from "../TypeAlerts";
import TypeParametersPage from "../TypeParameters";
import RegisterStationPage from "../RegisterStation";

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
      <Route
        path="/registarestacao"
        element={
          <ProtectedRoute>
            <RegisterStationPage />
          </ProtectedRoute>
        }></Route>
      <Route
        path="/listatipodealerta"
        element={
          <ProtectedRoute>
            <TypeAlertsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/listatipodeparametro"
        element={
          <ProtectedRoute>
            <TypeParametersPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AuthenticatedRoutes;