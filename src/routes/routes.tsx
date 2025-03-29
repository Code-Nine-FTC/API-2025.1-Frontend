import { Routes, Route } from "react-router-dom";

import About from "@pages/About";
import ResponsiveDrawer from "@components/sidebar";
import LoginPage from "@pages/login";
import RegisterStations from "@pages/RegisterStation";
import EditStations from "@pages/EditStation";
import Education from "@pages/Education";
import AlertList from "@pages/AlertList";
import ViewStations from "@pages/ViewStation";

export default function AppRoutes() {
  return (
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/educacao" element={<Education />} />
        <Route path="/teste" element={<ResponsiveDrawer />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrarestacao" element={<RegisterStations />} />
        <Route path="/editarestacao" element={<EditStations />} />
      </Routes>
  );
}
