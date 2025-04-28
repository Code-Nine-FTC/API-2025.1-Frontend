import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "../Dashboard";
import ProtectedRoute from "../../components/ProtectedRoute";
import TypeAlertsPage from "../TypeAlertsList";
import TypeParametersPage from "../TypeParametersList";
import RegisterStationPage from "../RegisterStation";
import StationsListPage from "../StationsList";
import AlertsPage from "../Alerts";
import RegisterParameterType from "../RegisterParameterType";// Importe o componente de cadastro/edição
import ProfilePage from "../Profile";
import RegisterAlertType from "../RegisterTypeAlert";
import AlertTypePage from "../AlertType";

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
      <Route
        path="/list-alerts"
        element={
          <ProtectedRoute>
            <AlertsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register-parameter-type"
        element={
          <ProtectedRoute>
            <RegisterParameterType />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/register-type-alert"
        element={
          <ProtectedRoute>
            <RegisterAlertType />
          </ProtectedRoute>
        }
      />

      <Route
        path="/register-type-alert/:id"
        element={
          <ProtectedRoute>
            <RegisterAlertType />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-type-alert/:id"
        element={
          <ProtectedRoute>
            <AlertTypePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AuthenticatedRoutes;