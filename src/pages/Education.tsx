import React, { useState } from "react";
import "./styles/education.css";  
import Pagination from "@mui/material/Pagination";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import tecsusImg from "/src/assets/tecsuscard.jpeg";
import pluviometroImg from "/src/assets/pluviometro.jpg";
import pluviometro2Img from "/src/assets/pluviometro2.jpg";
import SearchBar from "../components/searchbar"; 

const Education: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    console.log("Buscar por:", searchTerm);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const cards = [
    {
      title: "TecSUS - Tecnologia e Sustentabilidade",
      heading: "Quem é a TecSUS?",
      text: "A TecSUS desenvolve soluções tecnológicas para sustentabilidade, incluindo monitoramento ambiental...",
      fullText: "A nossa equipe desenvolveu esse projeto em parceria com a TecSUS, uma empresa inovadora e comprometida com o desenvolvimento tecnológico sustentável. A TecSUS é uma empresa que se dedica ao desenvolvimento de dispositivos, aplicativos e sistemas para transmissão e recepção de dados, controle de equipamentos remotos e gestão de faturas. Seus produtos são aplicados nos setores de abastecimento de água, distribuição de eletricidade e gás natural.",
      author: "Equipe TecSUS",
      imgSrc: tecsusImg,
    },
    {
      title: "O que é uma Estação Meteorológica?",
      heading: "Definição e Utilização",
      text: "Uma estação meteorológica é uma instalação que mede parâmetros climáticos como temperatura...",
      fullText: "Uma estação meteorológica é uma instalação fixa (ou móvel) que reúne diversos instrumentos para medir parâmetros como temperatura, umidade, pressão atmosférica, velocidade e direção do vento, precipitação, radiação solar e outros. Esses dados são fundamentais tanto para a previsão do tempo quanto para estudos climáticos e aplicações em diversas áreas, como agricultura, aviação, defesa civil e gestão de recursos hídricos.",
      author: "Equipe TecSUS",
      imgSrc: pluviometroImg,
    },
    {
      title: "Anemômetro - Medindo o Vento",
      heading: "Como Funciona um Anemômetro?",
      text: "O anemômetro mede a velocidade e a direção do vento. Esse instrumento deve ser instalado a dois metros de altura...",
      fullText: "O anemômetro é um instrumento que mede a velocidade e a direção do vento. Esse instrumento deve ser instalado a dois metros de altura em relação ao solo. Ele é de vital importância, uma vez que, ao saber a velocidade do vento, pode-se identificar mudanças nos padrões climáticos e, com isso, prever tempestades ou outros fenômenos. O exemplo mais comum de anemômetro é o de copo, que calcula a velocidade registrando o número de rotações dos copos em um determinado intervalo de tempo. Há também anemômetros sônicos e de hélice.",
      author: "Equipe TecSUS",
      imgSrc: pluviometro2Img,
    },
    {
      title: "Pluviômetro - Medindo a Chuva",
      heading: "O que é um Pluviômetro?",
      text: "O pluviômetro é um instrumento utilizado para medir a quantidade de precipitação de chuva...",
      fullText: "O pluviômetro é um instrumento utilizado para medir a quantidade de precipitação de chuva em um determinado período. A unidade de medida mais frequentemente utilizada é o milímetro (mm). Cada milímetro de precipitação corresponde a um litro de água por metro quadrado. Entre os diversos tipos de pluviômetros, o pluviômetro de balança basculante é um dos mais comuns. Este tipo de pluviômetro recolhe a água da chuva num recipiente e, sempre que é atingida uma quantidade específica de água, uma balança basculante gera um pulso elétrico. Ajusta-se a calibração do pluviômetro para que cada pulso represente uma quantidade fixa de precipitação, que geralmente é de 0,2 mm.",
      author: "Equipe TecSUS",
      imgSrc: pluviometroImg,
    },
  ];

  const displayedCards = cards.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="education-container">
      <div className="header"></div>

      <SearchBar 
        placeholder="Buscar conteúdos..."
        value={searchTerm}
        onChange={handleSearchChange}
        onSearchClick={handleSearchClick}
      />

      {displayedCards.map((card, index) => (
        <div className="cards-container" key={index}>
          <div className="info-card">
            <div className="image-container">
              <img src={card.imgSrc} alt="Card" />
            </div>
            <div className="content-container">
              <p className="title">{card.title}</p>
              <p className="heading">{card.heading}</p>
              <p className="text">{truncateText(card.text, 150)}</p>
              <p className="text"><strong>Escrito por:</strong> {card.author}</p>
              <a href="#" className="link" onClick={() => handleOpenModal(card)}>LER MAIS</a>
            </div>
          </div>
        </div>
      ))}

      <div className="pagination-container">
        <Pagination count={Math.ceil(cards.length / itemsPerPage)} page={page} onChange={handleChange} />
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="modal-box">
          {selectedCard && (
            <>
              <div className="modal-header" style={{ backgroundImage: `url(${selectedCard.imgSrc})` }}></div>
              <div className="modal-content">
                <h2>{selectedCard.heading}</h2>
                <p><strong>Escrito por:</strong> {selectedCard.author}</p>
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
