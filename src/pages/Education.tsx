import React, { useState } from "react";
import "./styles/education.css";  
import Pagination from "@mui/material/Pagination";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import SearchBar from "../components/searchbar";
import { educationCards } from "../data/educationData";

const Education: React.FC = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleOpenModal = (card: any) => {
    setSelectedCard(card);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCard(null);
  };

  const displayedCards = educationCards.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="education-container">
      <div className="header"></div>

      <SearchBar placeholder="Buscar conteúdos..." />

      {displayedCards.map((card, index) => (
        <div className="cards-container" key={index}>
          <div className="info-card">
            <div className="image-container">
              <img src={card.imgSrc} alt="Card" />
            </div>
            <div className="content-container">
              <p className="title">{card.title}</p>
              <p className="heading">{card.heading}</p>
              <p className="text">{card.text}</p>
              <a href="#" className="link" onClick={() => handleOpenModal(card)}>LER MAIS</a>
            </div>
          </div>
        </div>
      ))}

      <div className="pagination-container">
        <Pagination count={Math.ceil(educationCards.length / itemsPerPage)} page={page} onChange={handleChange} />
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="modal-box">
          {selectedCard && (
            <>
              <div className="modal-header" style={{ backgroundImage: `url(${selectedCard.imgSrc})` }}></div>
              <div className="modal-content">
                <h2>{selectedCard.heading}</h2>
                <p>{selectedCard.fullText}</p>
                <button onClick={handleCloseModal} className="close-button">Fechar</button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Education;
