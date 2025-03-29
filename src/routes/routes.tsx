import { Routes, Route, Navigate } from "react-router-dom";

import About from "@pages/About";
import LoginPage from "@pages/login";
import RegisterStations from "@pages/RegisterStation";
import RegisterAlertType from "@pages/RegisterAlertType";

import Education from "@pages/Education";
import AlertList from "@pages/AlertList";
import RegisterParameterType from "@pages/RegisterParameterType";
import ViewStations from "@pages/ViewStation";
import EditStation from "@pages/EditStation";

export default function AppRoutes() {
  return (
      <Routes>
         <Route path="*" element={<Navigate to="/about" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/educacao" element={<Education />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrarestacao" element={<RegisterStations />} />
        <Route path="/registraralerta" element={<RegisterAlertType />} />
		<Route path="/registrartipoparametro" element={<RegisterParameterType />} />

        <Route path="/editarestacao" element={<EditStation />} />
      </Routes>
  );
}