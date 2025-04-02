import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CombinedList from "@pages/CombinedList";
import About from "@pages/About";
//import ResponsiveDrawer from "@components/sidebar";
import LoginPage from "@pages/login";
import RegisterStations from "@pages/RegisterStation";
import Education from "@pages/Education";
import AlertList from "@pages/AlertList";
import StationListPage from "@pages/StationList";
import RegisterAlertType from "@pages/RegisterAlertType";
//import ParameterTypeList from "@pages/ParameterTypeList";
import { ProtectedRoute } from "../services/authContext";
import { EditAlertType } from "@pages/EditAlertType";
import AlertTypeList from "@pages/AlertTypeList";
import RegisterParameterType from "@pages/RegisterParameterType";
import ParameterTypeList from "@pages/ParameterTypeList";
import EditParameterType from "@pages/EditParameterType";
import ViewStations from "@pages/ViewStation";
import Profile from "@pages/Profile"; // Importar a página de perfil

export default function AppRoutes() {
  return (
      <Routes>
        <Route path="*" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/educacao" element={<Education />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/listagem-combinada" element={<CombinedList />} />
        <Route path="/visualizarestacao/:id" element={<ViewStations />} />
        <Route path="/registrarestacao" element={
          <ProtectedRoute>
            <RegisterStations />
          </ProtectedRoute>
        } />
        <Route path="/listarestacao" element={<StationListPage />} />

        <Route path="/registrartipoalerta" element={
          <ProtectedRoute>
            <RegisterAlertType />
          </ProtectedRoute>
        } />
        <Route path="/listartipoalerta" element={
          <ProtectedRoute>
            <AlertTypeList />
          </ProtectedRoute>
        } />
        <Route path="/listalerts" element={<AlertList />} />
        <Route path="/editaralerta/:id" element={
          <ProtectedRoute>	
          <EditAlertType />
          </ProtectedRoute>
        } />

        <Route path="/registrarparametro" element={
          <ProtectedRoute>
            <RegisterParameterType />
          </ProtectedRoute>
        } />
        <Route path="/listartipoparametro" element={
          <ProtectedRoute>
            <ParameterTypeList />
          </ProtectedRoute>
        } />
        <Route path="/editarparametrotipo/:parameterTypeId" element={
          <ProtectedRoute>
            <EditParameterType />
          </ProtectedRoute>} />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
  );
}
