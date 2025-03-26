import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import "../pages/styles/education.css";  

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClick?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Pesquisar...", 
  value = "", 
  onChange, 
  onSearchClick 
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onSearchClick) {
      event.preventDefault();
      onSearchClick();
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input 
          type="text" 
          className="search-input" 
          placeholder={placeholder} 
          value={value}
          onChange={onChange} 
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="search-button" onClick={onSearchClick}>
          <SearchIcon className="search-icon" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
