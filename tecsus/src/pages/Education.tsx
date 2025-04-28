import React, { useState } from "react";
import "./styles/education.css";
import Pagination from "@mui/material/Pagination";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import SearchBar from "../components/ui/Searchbar";
import { educationCards } from "../data/educationData";
import DefaultLayout from "../layout/layoutNotLogged";


const Education: React.FC = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  
  interface EducationCard {
    title?: string;
    heading?: string;
    text?: string;
    imgSrc?: string;
    fullText?: string;
  }

  const [selectedCard, setSelectedCard] = useState<EducationCard | null>(null);

  const handleChange = (_: unknown, value: number) => {
    setPage(value);
  };

  const handleOpenModal = (card: EducationCard) => {
    setSelectedCard(card);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCard(null);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchClick = () => {
    const term = searchInput.trim().toLowerCase();
    setSearchTerm(term);
    setPage(1);
  };

  const filteredCards = educationCards.filter((card) => {
    const title = card.title?.toLowerCase() || "";
    const heading = card.heading?.toLowerCase() || "";
    const text = card.text?.toLowerCase() || "";
    return (
      title.includes(searchTerm) ||
      heading.includes(searchTerm) ||
      text.includes(searchTerm)
    );
  });

  const displayedCards = filteredCards.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <DefaultLayout>
      <div className="education-container">
        <div className="header"></div>

        <SearchBar
          placeholder="Buscar conteúdos..."
          value={searchInput}
          onChange={handleInputChange}
          onSearchClick={handleSearchClick}
        />

        {displayedCards.length === 0 ? (
          <p className="no-results">Nenhum resultado encontrado.</p>
        ) : (
          displayedCards.map((card, index) => (
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
          ))
        )}

        {filteredCards.length > itemsPerPage && (
          <div className="pagination-container">
            <Pagination
              count={Math.ceil(filteredCards.length / itemsPerPage)}
              page={page}
              onChange={handleChange}
            />
          </div>
        )}

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
      </DefaultLayout>
  );
};

export default Education;
