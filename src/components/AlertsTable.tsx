import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import { links } from "../services/api";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: number;
  station: string;
  startDate: string;
  endDate: string;
}

const AlertsTable: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await links.listAlerts();
        if (response.success) {
          const alertsData = response.data?.map((item: any) => ({
            id: item.id,
            station: item.station_name,
            startDate: item.create_date,
            endDate: item.create_date,
          })) || [];
          setAlerts(alertsData);
          setFilteredAlerts(alertsData);
        } else {
          setError(response.error || "Erro ao carregar os alertas.");
        }
      } catch (err) {
        setError("Erro ao carregar os alertas.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAlerts();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredAlerts(alerts);
      return;
    }

    const filtered = alerts.filter((alert) =>
      alert.station.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAlerts(filtered);
  };

  const handleAddAlert = () => {
    console.log("Adicionar alerta");
  };

  const columns = [
    { label: "ID", key: "id" as keyof Alert },
    { label: "Estação", key: "station" as keyof Alert },
    { label: "Data Inicial", key: "startDate" as keyof Alert },
    { label: "Data Final", key: "endDate" as keyof Alert },
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
        <button onClick={handleAddAlert} className="data-table-button">
          + Cadastrar
        </button>
      </div>
      <DataTable<Alert>
        data={filteredAlerts}
        columns={columns}
        loading={loading}
        error={error}
        title=""
        renderActions={(row) => (
          <SearchIcon
            style={{ color: "#ccc", cursor: "pointer" }}
            onClick={() => navigate(`/alert-details/${row.id}`)}
          />
        )}
      />
    </div>
  );
};

export default AlertsTable;