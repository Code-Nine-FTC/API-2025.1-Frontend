import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import { links } from "../services/api";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

interface Station {
    id: number;
    name: string;
    uid: string;
    address: string[];
    latitude: Number;
    longitude: Number;
    last_update: string;
}

const StationTable: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await links.listStations();
        if (response.success) {
          setStations(response.data);
          setFilteredStations(response.data);
        } else {
          setError(response.error || "Erro ao carregar as estações.");
        }
      } catch (err) {
        setError("Erro ao carregar as estações.");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setStations(stations);
      return;
    }

    const filtered = stations.filter((station) =>
      station.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStations(filtered);
  };

  const handleAddAlert = () => {
    console.log("Adicionar alerta");
  };

  const columns = [
    { label: "UID", key: "uid" as keyof Station },
    { label: "Nome", key: "name" as keyof Station },
    { label: "Endereço", key: "adress" as keyof Station },
    { label: "Latitude", key: "latitude" as keyof Station },
    { label: "Longitude", key: "longitude" as keyof Station },
    { label: "Última atualzição", key: "last_update" as keyof Station },
  ];

  return (
    <div>
      <div className="data-table-header">
        <input
          type="text"
          placeholder="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="data-table-search"
        />
        <button onClick={handleSearch} className="data-table-button">
          Buscar
        </button>
        <button onClick={handleAddAlert} className="data-table-button" style={{backgroundColor: "#62B620"}}>
          + Cadastrar
        </button>
      </div>
      <DataTable<Station>
        data={filteredStations}
        columns={columns}
        loading={loading}
        error={error}
        title=""
        renderActions={(row) => (
          <SearchIcon
            style={{ color: "#ccc", cursor: "pointer" }}
            onClick={() => navigate(`/station-details/${row.id}`)}
          />
        )}
      />
    </div>
  );
};

export default StationTable;