import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { links } from "../services/api";
import { Modal, Box, Typography, CircularProgress, Button, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { useNavigate } from "react-router-dom";

interface AlertType {
  id: number;
  name: string;
  value: number;
  math_signal: string;
  status: string;
  parameter_id: number;
  station_id?: number;
}

const AlertTypeList: React.FC = () => {
  const [alertTypes, setAlertTypes] = useState<AlertType[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAlertTypes = async (filters?: { [key: string]: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await links.listAlertTypes(filters || {});
      console.log("Resposta recebida no AlertTypeList:", response);

      if (response.success) {
        const alertsData = response.data || [];
        console.log("Dados processados no AlertTypeList:", alertsData);
        setAlertTypes(alertsData.map(alert => ({
          ...alert,
          status: alert.status || "Unknown", 
          parameter_id: alert.parameter_id ?? 0, 
        })));
        setFilteredAlerts(alertsData.map(alert => ({
          ...alert,
          status: alert.status || "Unknown",
          parameter_id: alert.parameter_id ?? 0,
        })));
      } else {
        setError(response.error || "Erro ao carregar os tipos de alerta.");
      }
    } catch (err) {
      console.error("Erro ao carregar os tipos de alerta:", err);
      setError("Erro ao carregar os tipos de alerta.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlertDetails = (alertId: number) => {
    setModalLoading(true);
    setError(null);

    try {
      const alert = alertTypes.find((item) => item.id === alertId);

      if (alert) {
        setSelectedAlert(alert);
        setModalOpen(true);
      } else {
        setError("Tipo de alerta não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar os detalhes do alerta:", err);
      setError("Erro ao carregar os detalhes do alerta.");
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertTypes();
  }, []);

  const handleSearch = () => {
    const filters: { [key: string]: string } = {};
    if (nameFilter.trim()) filters.name = nameFilter;

    fetchAlertTypes(filters);
  };

  const handleEdit = (alertId: number) => {
    navigate(`/editaralerta/${alertId}`);
  };

  const columns = [
    { label: "ID", key: "id" as keyof AlertType },
    { label: "Nome", key: "name" as keyof AlertType },
    { label: "Valor", key: "value" as keyof AlertType },
    { label: "Sinal", key: "math_signal" as keyof AlertType },
    { label: "Status", key: "status" as keyof AlertType },
    { label: "Parâmetro ID", key: "parameter_id" as keyof AlertType },
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
          Tipos de Alerta
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
          <TextField
            label="Filtrar por nome"
            variant="outlined"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{ backgroundColor: "#5f5cd9", color: "white", height: "56px" }}
          >
            Buscar
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/registrartipoalerta")} 
            startIcon={<AddIcon />}
            sx={{ backgroundColor: "#4caf50", color: "white", height: "56px" }}
          >
            Cadastrar
          </Button>
        </Box>
        <DataTable<AlertType>
          data={filteredAlerts}
          columns={columns}
          loading={loading}
          error={error}
          renderActions={(row) => (
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button
                variant="text"
                onClick={() => fetchAlertDetails(row.id)}
                sx={{ color: "#5f5cd9" }}
              >
                <SearchIcon />
              </Button>
              <EditIcon
                sx={{ color: "#4caf50", cursor: "pointer" }}
                onClick={() => handleEdit(row.id)}
              />
            </Box>
          )}
        />
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "500px",
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
                <Typography variant="h6" component="h2" sx={{ marginBottom: "16px" }}>
                  Detalhes do Alerta
                </Typography>
                <Typography><strong>ID:</strong> {selectedAlert.id}</Typography>
                <Typography><strong>Nome:</strong> {selectedAlert.name}</Typography>
                <Typography><strong>Valor:</strong> {selectedAlert.value}</Typography>
                <Typography><strong>Sinal Matemático:</strong> {selectedAlert.math_signal}</Typography>
                <Typography><strong>Status:</strong> {selectedAlert.status}</Typography>
                <Typography><strong>ID Parâmetro:</strong> {selectedAlert.parameter_id}</Typography>
              </div>
            ) : (
              <Typography>Erro ao carregar os detalhes do alerta.</Typography>
            )}
          </Box>
        </Modal>
      </Box>
    </LoggedLayout>
  );
};

export default AlertTypeList;