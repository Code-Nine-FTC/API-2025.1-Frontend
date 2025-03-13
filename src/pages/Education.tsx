import React, { useState } from "react";
import "./styles/education.css";  
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";

const Education: React.FC = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 2;

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const cards = [
    {
      title: "Aprenda Conosco",
      date: "11 Março 2025",
      heading: "Coleta de Dados - Como o Pluviômetro Mede a Chuva?",
      text: "Existem dois tipos principais de pluviômetros usados em estações meteorológicas...",
      author: "Diogo Branquinho",
      imgSrc: "https://via.placeholder.com/150",
    },
    {
      title: "COMO AVISAR SOBRE O TOTAL DE CHUVA?",
      date: "11 Março 2025",
      heading: "Uma estação meteorológica pode emitir alertas de chuva intensa com base em limites predefinidos de precipitação. Alguns exemplos:",
      text: "Chuva Moderada: 5 a 20 mm/h Chuva Forte: 20 a 50 mm/h Chuva Extrema: Acima de 50 mm/h",
      author: "Diogo Branquinho",
      imgSrc: "https://via.placeholder.com/150",
    },
  ];

  const displayedCards = cards.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="education-container">
      {/* Header */}
      <div className="header"></div>

      {/* Barra de Pesquisa */}
      <div className="search-bar-container">
        <div className="search-bar">
          <input type="text" className="search-input" placeholder="Pesquisar..." />
          <button className="search-button">
            <SearchIcon className="search-icon" />
          </button>
        </div>
      </div>

      {/* Cards */}
      {displayedCards.map((card, index) => (
        <div className="cards-container" key={index}>
          <div className="info-card">
            <div className="image-container">
              <img src={card.imgSrc} alt="Card" />
            </div>
            <div className="content-container">
              <p className="title">{card.title}</p>
              <p className="date">{card.date}</p>
              <p className="heading">{card.heading}</p>
              <p className="text">{card.text}</p>
              <p className="text"><strong>Escrito por:</strong> {card.author}</p>
              <a href="#" className="link">LER MAIS</a>
            </div>
          </div>
        </div>
      ))}

      {/* Paginação */}
      <Pagination count={Math.ceil(cards.length / itemsPerPage)} page={page} onChange={handleChange} />
    </div>
  );
};

export default Education;
