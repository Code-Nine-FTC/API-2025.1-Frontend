import { Routes, Route } from "react-router-dom";
import Home from "@pages/Home";
import About from "@pages/About";
import ResponsiveDrawer from "@components/sidebar";

export default function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/teste" element={<ResponsiveDrawer />} />
      </Routes>
  );
}
