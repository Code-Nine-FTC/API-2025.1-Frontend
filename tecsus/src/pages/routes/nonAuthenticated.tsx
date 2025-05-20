import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "../About";
import LoginPage from "../Login";
import Education from "../Education";
import StationPage from "../Station";
import TypeParameterPage from "../TypeParameter";
import PublicListsPage from "../PublicListsPage"; // Certifique-se de que o caminho está correto
import Games from "../Games";

const nonAuthenticatedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/education" element={<Education />} />
      <Route path="/view-station/:id" element={<StationPage />} />
      <Route path="/view-type-parameter/:id" element={<TypeParameterPage />} />
      <Route path="/public-lists" element={<PublicListsPage />} />
      <Route path="/games" element={<Games />} />
    </Routes>
  );
};

export default nonAuthenticatedRoutes;