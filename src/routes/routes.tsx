import { Routes, Route } from "react-router-dom";
import Home from "@pages/Home";
import About from "@pages/About";
import ResponsiveDrawer from "@components/sidebar";
import Education from "@pages/Education";

export default function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/teste" element={<ResponsiveDrawer />} />
        <Route path="/educacao" element={<Education />} />
      </Routes>
  );
}
