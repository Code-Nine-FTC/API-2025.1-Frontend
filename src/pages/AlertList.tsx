import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { links } from "../services/api";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { Modal, Box, Typography, CircularProgress, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
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

        // Aplica os filtros diretamente nos dados retornados
        const filtered = alertsData.filter((alert) => {
          const matchesType = filters?.type_alert_name
            ? alert.typeAlertName === filters.type_alert_name
            : true;
          const matchesStation = filters?.station_name
            ? alert.station === filters.station_name
            : true;
          return matchesType && matchesStation;
        });

        setFilteredAlerts(filtered);
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

  const handleOpenModal = (alert: Alert) => {
    setSelectedAlert(alert);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
    setModalOpen(false);
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
        <Typography
          variant="h4"
          sx={{
            marginBottom: "20px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#5f5cd9",
          }}
        >
          Alertas
        </Typography>
        <div className="data-table-header" style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Alerta</InputLabel>
            <Select
              value={typeAlertName}
              onChange={(e) => setTypeAlertName(e.target.value)}
              label="Tipo de Alerta"
            >
              <MenuItem value="">
                <em>Selecione o Tipo de Alerta</em>
              </MenuItem>
              {alertTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Estação</InputLabel>
            <Select
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              label="Estação"
            >
              <MenuItem value="">
                <em>Selecione a Estação</em>
              </MenuItem>
              {stations.map((station, index) => (
                <MenuItem key={index} value={station}>
                  {station}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSearch}
            style={{ backgroundColor: "#5f5cd9", color: "white", height: "56px" }}
          >
            Buscar
          </Button>
        </div>
        <DataTable<Alert>
          data={filteredAlerts}
          columns={columns}
          loading={loading}
          error={error}
          renderActions={(row) => (
            <SearchIcon
              style={{ color: "#ccc", cursor: "pointer" }}
              onClick={() => handleOpenModal(row)}
            />
          )}
        />
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "500px",
              bgcolor: "#333", // Fundo escuro
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              color: "white", // Texto branco
              border: "2px solid #5f5cd9", // Borda roxa
            }}
          >
            {selectedAlert ? (
              <div>
                <Typography variant="h6" component="h2" sx={{ marginBottom: "16px", color: "white" }}>
                  Detalhes do Alerta
                </Typography>
                <Typography sx={{ color: "white" }}><strong>ID:</strong> {selectedAlert.id}</Typography>
                <Typography sx={{ color: "white" }}><strong>Valor da Medida:</strong> {selectedAlert.measureValue}</Typography>
                <Typography sx={{ color: "white" }}><strong>Tipo de Alerta:</strong> {selectedAlert.typeAlertName}</Typography>
                <Typography sx={{ color: "white" }}><strong>Estação:</strong> {selectedAlert.station}</Typography>
                <Typography sx={{ color: "white" }}><strong>Data Inicial:</strong> {selectedAlert.startDate}</Typography>
                <Typography sx={{ color: "white" }}><strong>Data Final:</strong> {selectedAlert.endDate}</Typography>
              </div>
            ) : (
              <CircularProgress />
            )}
          </Box>
        </Modal>
      </div>
    </LoggedLayout>
  );
};

export default AlertList;