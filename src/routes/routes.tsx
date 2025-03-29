import { Routes, Route, Navigate } from "react-router-dom";

import About from "@pages/About";
import ResponsiveDrawer from "@components/sidebar";
import LoginPage from "@pages/login";
import RegisterStations from "@pages/RegisterStation";
import RegisterAlert from "@pages/RegisterAlert";

import Education from "@pages/Education";

export default function AppRoutes() {
  return (
      <Routes>
         <Route path="*" element={<Navigate to="/about" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/educacao" element={<Education />} />
        <Route path="/teste" element={<ResponsiveDrawer />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrarestacao" element={<RegisterStations />} />
        <Route path="/registraralerta" element={<RegisterAlert />} />

      </Routes>
  );
}
