import { Routes, Route } from "react-router-dom";

import About from "@pages/About";
import ResponsiveDrawer from "@components/sidebar";
import LoginPage from "@pages/login";
import Education from "@pages/Education";

export default function AppRoutes() {
  return (
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/teste" element={<ResponsiveDrawer />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/education" element={<Education />} />
      </Routes>
  );
}
