import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../Home";
import LoginPage from "../Login";

const nonAuthenticatedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default nonAuthenticatedRoutes;