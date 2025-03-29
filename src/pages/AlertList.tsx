import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { links } from "../services/api";
import { Modal, Box, Typography, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LoggedLayout } from "@components/layout/layoutLogged";

interface Alert {
  id: number;
  measureValue: string;
  typeAlertName: string;
  station: string;
  startDate: string;
}

const AlertList: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [typeAlertName, setTypeAlertName] = useState("");
  const [stationName, setStationName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

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

  const fetchAlertDetails = (alertId: number) => {
    setModalLoading(true);
    setError(null);

    try {
      // Busca o alerta diretamente na lista de alertas já carregados
      const alert = alerts.find((item) => item.id === alertId);

      if (alert) {
        setSelectedAlert(alert);
        setModalOpen(true);
      } else {
        setError("Alerta não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar os detalhes do alerta:", err);
      setError("Erro ao carregar os detalhes do alerta.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId: number) => {
    const confirmDelete = window.confirm("Tem certeza de que deseja excluir este alerta?");
    if (!confirmDelete) return;

    try {
      const response = await links.deleteAlert(alertId);
      if (response.success) {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
        setFilteredAlerts((prevFilteredAlerts) =>
          prevFilteredAlerts.filter((alert) => alert.id !== alertId)
        );
        alert("Alerta excluído com sucesso!");
      } else {
        alert(response.error || "Erro ao excluir o alerta.");
      }
    } catch (err) {
      console.error("Erro ao excluir o alerta:", err);
      alert("Erro ao excluir o alerta.");
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
  ];

  const isUserLoggedIn = () => {
    return true;
  };

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
            {Array.from(new Set(alerts.map((alert) => alert.typeAlertName))).map((type, index) => (
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
            {Array.from(new Set(alerts.map((alert) => alert.station))).map((station, index) => (
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
            <div style={{ display: "flex", gap: "8px" }}>
              <SearchIcon
                style={{ color: "#ccc", cursor: "pointer" }}
                onClick={() => fetchAlertDetails(row.id)}
              />
              {isUserLoggedIn() && (
                <button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteAlert(row.id)}
                >
                  Excluir
                </button>
              )}
            </div>
          )}
        />
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {modalLoading ? (
              <CircularProgress />
            ) : selectedAlert ? (
              <div>
                <Typography variant="h6" component="h2">
                  Detalhes do Alerta
                </Typography>
                <Typography><strong>ID:</strong> {selectedAlert.id}</Typography>
                <Typography><strong>Valor da Medida:</strong> {selectedAlert.measureValue}</Typography>
                <Typography><strong>Tipo de Alerta:</strong> {selectedAlert.typeAlertName}</Typography>
                <Typography><strong>Estação:</strong> {selectedAlert.station}</Typography>
                <Typography><strong>Data de Criação:</strong> {selectedAlert.startDate}</Typography>
              </div>
            ) : (
              <Typography>Erro ao carregar os detalhes do alerta.</Typography>
            )}
          </Box>
        </Modal>
      </div>
    </LoggedLayout>
  );
};

export default AlertList;