import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "../Dashboard";
import ProtectedRoute from "../../components/ProtectedRoute";
import TypeAlertsPage from "../TypeAlerts";
import TypeParametersPage from "../TypeParameters";
import RegisterStationPage from "../RegisterStation";
import StationsListPage from "../StationsList";

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
        path="/list-station"
        element={
          <ProtectedRoute>
            <StationsListPage />
          </ProtectedRoute>
        }></Route>
      <Route
        path="/register-station"
        element={
          <ProtectedRoute>
            <RegisterStationPage />
          </ProtectedRoute>
        }></Route>
      <Route
        path="/list-alert-type"
        element={
          <ProtectedRoute>
            <TypeAlertsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/list-parameter-type"
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