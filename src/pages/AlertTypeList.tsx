import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { links } from "../services/api";
import { Modal, Box, Typography, CircularProgress, Button, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Ícone para visualizar
import EditIcon from "@mui/icons-material/Edit"; // Ícone para editar
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb"; // Ícone para desativar
import { LoggedLayout } from "@components/layout/layoutLogged";
import { useNavigate } from "react-router-dom";
import ReusableModal from "@components/ReusableModal";

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
      const response = await links.listAlertTypes(filters || {}); // Envia os filtros para o backend
      console.log("Resposta recebida no AlertTypeList:", response);

      if (response.success) {
        const alertsData = response.data || [];
        console.log("Dados processados no AlertTypeList:", alertsData);
        setAlertTypes(alertsData.map(alert => ({
          ...alert,
          status: alert.status || "unknown", 
          parameter_id: alert.parameter_id ?? 0, 
        })));
        setFilteredAlerts(alertsData.map(alert => ({
          ...alert,
          status: alert.status || "unknown", 
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

  const handleDisable = async (alertTypeId: number) => {
    if (!window.confirm("Tem certeza que deseja desativar este tipo de alerta?")) {
      return;
    }

    try {
      const response = await links.disableAlertType(alertTypeId); // Chama o método do serviço
      if (response.success) {
        alert("Tipo de alerta desativado com sucesso!");
        fetchAlertTypes(); // Atualiza a lista após a desativação
      } else {
        alert(response.error || "Erro ao desativar o tipo de alerta.");
      }
    } catch (err) {
      console.error("Erro ao desativar o tipo de alerta:", err);
      alert("Erro ao desativar o tipo de alerta.");
    }
  };

  useEffect(() => {
    fetchAlertTypes();
  }, []);

  const handleSearch = () => {
    const filters: { [key: string]: string } = {};
    if (nameFilter.trim()) {
      filters.name = nameFilter.toLowerCase(); // Converte para minúsculas para comparação
    }

    // Filtragem no Frontend
    const filtered = alertTypes.filter((alert) =>
      alert.name.toLowerCase().includes(filters.name || "")
    );

    setFilteredAlerts(filtered);
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
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            alignItems: "center", // Alinha os itens verticalmente
            flexWrap: "wrap", // Permite que os itens quebrem linha em telas menores
          }}
        >
          <TextField
            label="Filtrar por nome"
            variant="outlined"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            sx={{ flex: 1 }} // Faz o campo de texto ocupar o espaço restante
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{
              backgroundColor: "#5f5cd9",
              color: "white",
              height: "56px", // Garante altura consistente
              whiteSpace: "nowrap", // Evita quebra de texto
            }}
          >
            Buscar
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/registrartipoalerta")}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              height: "56px", // Garante altura consistente
              whiteSpace: "nowrap", // Evita quebra de texto
            }}
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
              {/* Ícone para visualizar detalhes */}
              <SearchIcon
                sx={{ color: "#5f5cd9", cursor: "pointer" }}
                onClick={() => fetchAlertDetails(row.id)}
              />
              {/* Ícone para editar */}
              <EditIcon
                sx={{ color: "#4caf50", cursor: "pointer" }}
                onClick={() => handleEdit(row.id)}
              />
              {/* Ícone para desativar */}
              <DoNotDisturbIcon
                sx={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDisable(row.id)}
              />
            </Box>
          )}
        />
		{/* Modal para detalhes do alerta */}
		<ReusableModal
		  open={modalOpen}
		  onClose={() => setModalOpen(false)}
		  title="Detalhes do Alerta"
		  loading={modalLoading}
		>
		  {selectedAlert ? (
			<div>
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
		</ReusableModal>
      </Box>
    </LoggedLayout>
  );
};

export default AlertTypeList;