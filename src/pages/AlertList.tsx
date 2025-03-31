import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { links } from "../services/api";
import { Modal, Box, Typography, CircularProgress, Button, TextField, Paper, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { useNavigate } from "react-router-dom";
import ReusableModal from "@components/ReusableModal";
import Autocomplete from "@mui/material/Autocomplete";

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
  const [stationOptions, setStationOptions] = useState<string[]>([]);
  const [typeAlertOptions, setTypeAlertOptions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
	const fetchAlerts = async () => {
	  setLoading(true);
	  setError(null);
  
	  try {
		const response = await links.getFilteredAlerts();
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
  
		  // Atualizar opções para o Autocomplete
		  setStationOptions([...new Set(alertsData.map((alert) => alert.station))]);
		  setTypeAlertOptions([...new Set(alertsData.map((alert) => alert.typeAlertName))]);
		} else {
		  setError(response.error || "Erro ao carregar os alertas.");
		}
	  } catch (err) {
		setError("Erro ao carregar os alertas.");
	  } finally {
		setLoading(false);
	  }
	};
  
	fetchAlerts();
  }, []);

  const handleSearch = () => {
	const filtered = alerts.filter((alert) => {
	  const matchesTypeAlert = typeAlertName
		? alert.typeAlertName === typeAlertName
		: true;
  
	  const matchesStation = stationName
		? alert.station === stationName
		: true;
  
	  return matchesTypeAlert && matchesStation;
	});
  
	setFilteredAlerts(filtered);
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
      <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
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
        {/* Campos de busca */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Autocomplete
                fullWidth
                options={typeAlertOptions}
                inputValue={typeAlertName}
                onInputChange={(_, newInputValue) => setTypeAlertName(newInputValue || "")}
                onChange={(_, selectedValue) => setTypeAlertName(selectedValue || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filtrar por Tipo de Alerta"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
              <Autocomplete
                fullWidth
                options={stationOptions}
                inputValue={stationName}
                onInputChange={(_, newInputValue) => setStationName(newInputValue || "")}
                onChange={(_, selectedValue) => setStationName(selectedValue || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filtrar por Estação"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "var(--purple-maincolor)" }}
                  onClick={handleSearch}
                  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                >
                  Buscar
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Paper>

        <DataTable<Alert>
          data={filteredAlerts}
          columns={columns}
          loading={loading}
          error={error}
          renderActions={(row) => (
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button
                variant="text"
                onClick={() => handleOpenModal(row)}
                sx={{ color: "#5f5cd9" }}
              >
                <SearchIcon />
              </Button>
            </Box>
          )}
        />
		<ReusableModal
          open={modalOpen}
          onClose={handleCloseModal}
          title="Detalhes do Alerta"
        >
          {selectedAlert ? (
            <div>
              <Typography><strong>ID:</strong> {selectedAlert.id}</Typography>
              <Typography><strong>Tipo de Alerta:</strong> {selectedAlert.typeAlertName}</Typography>
              <Typography><strong>Estação:</strong> {selectedAlert.station}</Typography>
              <Typography><strong>Valor da Medida:</strong> {selectedAlert.measureValue}</Typography>
              <Typography><strong>Data Inicial:</strong> {selectedAlert.startDate}</Typography>
              <Typography><strong>Data Final:</strong> {selectedAlert.endDate}</Typography>
            </div>
          ) : (
            <Typography>Carregando...</Typography>
          )}
        </ReusableModal>
      </Box>
    </LoggedLayout>
  );
};

export default AlertList;