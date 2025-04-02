import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "../About";
import LoginPage from "../Login";

const nonAuthenticatedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default nonAuthenticatedRoutes;