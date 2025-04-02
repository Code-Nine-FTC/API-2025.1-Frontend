import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "../About";
import LoginPage from "../Login";
import Education from "../Education";

const nonAuthenticatedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/education" element={<Education />} />
    </Routes>
  );
};

export default nonAuthenticatedRoutes;