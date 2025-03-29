import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { links } from "../services/api";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { LoggedLayout } from "@components/layout/layoutLogged";

interface Alert {
  id: number;
  measureValue: string;
  typeAlertName: string;
  station: string;
  startDate: string;
  endDate: string;
}

const AlertList: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [typeAlertName, setTypeAlertName] = useState("");
  const [stationName, setStationName] = useState("");
  const navigate = useNavigate();

  // Extrai os tipos de alerta únicos da listagem de alertas
  const alertTypes = Array.from(new Set(alerts.map((alert) => alert.typeAlertName)));

  const stations = Array.from(new Set(alerts.map((alert) => alert.station)));

  const fetchAlerts = async (filters?: { [key: string]: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await links.getFilteredAlerts(filters || {});
      if (response.success) {
        const alertsData =
          response.data?.map((item: any) => ({
            id: item.id,
            measureValue: item.measure_value,
            typeAlertName: item.type_alert_name,
            station: item.station_name,
            startDate: item.create_date,
            endDate: item.create_date,
          })) || [];
        setAlerts(alertsData);
        if (filters) {
          const filtered = alertsData.filter((alert) => {
            const matchesType = filters.type_alert_name
              ? alert.typeAlertName === filters.type_alert_name
              : true;
            const matchesStation = filters.station_name
              ? alert.station === filters.station_name
              : true;
            return matchesType && matchesStation;
          });
          setFilteredAlerts(filtered);
        } else {
          setFilteredAlerts(alertsData);
        }
      } else {
        setError(response.error || "Erro ao carregar os alertas.");
      }
    } catch (err) {
      setError("Erro ao carregar os alertas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleSearch = () => {
    const filters: { [key: string]: string } = {};
    if (typeAlertName.trim()) filters.type_alert_name = typeAlertName;
    if (stationName.trim()) filters.station_name = stationName;

    fetchAlerts(filters);
  };

  const columns = [
    { label: "ID", key: "id" as keyof Alert },
    { label: "Estação", key: "station" as keyof Alert },
    { label: "Valor da Medida", key: "measureValue" as keyof Alert },
    { label: "Tipo de Alerta", key: "typeAlertName" as keyof Alert },
    { label: "Data Inicial", key: "startDate" as keyof Alert },
    { label: "Data Final", key: "endDate" as keyof Alert },
  ];

  return (
    <LoggedLayout>
      <div className="alerts-container">
        <h1 className="alerts-title">Alertas</h1>
        <div className="data-table-header">
          <select
            value={typeAlertName}
            onChange={(e) => setTypeAlertName(e.target.value)}
            className="data-table-select"
          >
            <option value="">Selecione o Tipo de Alerta</option>
            {alertTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="data-table-select"
          >
            <option value="">Selecione a Estação</option>
            {stations.map((station, index) => (
              <option key={index} value={station}>
                {station}
              </option>
            ))}
          </select>
          <button onClick={handleSearch} className="data-table-button">
            Buscar
          </button>
        </div>
        <DataTable<Alert>
          data={filteredAlerts}
          columns={columns}
          loading={loading}
          error={error}
          title="Lista de Alertas"
          renderActions={(row) => (
            <SearchIcon
              style={{ color: "#ccc", cursor: "pointer" }}
              onClick={() => navigate(`/alert-details/${row.id}`)}
            />
          )}
        />
      </div>
    </LoggedLayout>
  );
};

export default AlertList;