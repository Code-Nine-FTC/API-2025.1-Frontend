import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import GenericTable, { Column } from "../components/table";
import typeAlertGetters from "../store/typealerts/getters";
import { AlertTypeResponse } from "../store/typealerts/state";
import { LoggedLayout } from "../layout/layoutLogged";
import { useNavigate } from "react-router-dom";

const TypeAlertsPage = () => {
  const [typeAlerts, setTypeAlerts] = useState<AlertTypeResponse[]>([]);
  const [filteredTypeAlerts, setFilteredTypeAlerts] = useState<AlertTypeResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filtros
  const [nameFilter, setNameFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Modal
  const [selectedAlert, setSelectedAlert] = useState<AlertTypeResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTypeAlerts();
  }, []);

  const fetchTypeAlerts = async () => {
    try {
      setLoading(true);
      const response = await typeAlertGetters.listAlertTypes();
      if (response.success && response.data) {
        setTypeAlerts(response.data);
        setFilteredTypeAlerts(response.data); // Inicializa a lista filtrada
      } else {
        console.error("Erro ao buscar tipos de alertas:", response.error);
      }
    } catch (err) {
      console.error("Erro ao buscar tipos de alertas:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = typeAlerts;

    if (nameFilter.trim()) {
      filtered = filtered.filter((alert) =>
        alert.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (statusFilter.trim()) {
      filtered = filtered.filter((alert) => alert.status === statusFilter);
    }

    setFilteredTypeAlerts(filtered);
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setStatusFilter("");
    setFilteredTypeAlerts(typeAlerts); // Restaura a lista completa
  };

  const handleOpenModal = (alert: AlertTypeResponse) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
    setIsModalOpen(false);
  };

  const columns: Column<AlertTypeResponse>[] = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Nome" },
    { field: "value", headerName: "Valor" },
    { field: "math_signal", headerName: "Sinal Matemático" },
    { field: "status", headerName: "Status" },
    { field: "create_date", headerName: "Data de Criação" },
  ];

  return (
    <LoggedLayout>
      <Box display={"flex"} flexDirection="column" gap={2} p={2} m={5}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "var(--purple-maincolor)", fontWeight: "bold" }}
        >
          Tipos de Alertas
        </Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" gap={2}>
                <TextField
                  label="Nome"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  fullWidth
                  select
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="active">Ativo</MenuItem>
                  <MenuItem value="inactive">Inativo</MenuItem>
                </TextField>
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "rgb(39, 235, 65)",
                  color: "white",
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgb(30, 200, 50)",
                  },
                }}
                onClick={() => navigate("/register-type-alert")}
              >
                + Adicionar
              </Button>
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={handleResetFilters}>
                Limpar
              </Button>
              <Button variant="contained" onClick={applyFilters}>
                Buscar
              </Button>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ p: 3, mb: 3 }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <GenericTable
              columns={columns}
              rows={filteredTypeAlerts} // Usa a lista filtrada
              renderCell={(row, column) => {
                if (column.field === "create_date") {
                  return new Date(row[column.field] as string).toLocaleDateString();
                }
                return String(row[column.field]);
              }}
              renderActions={(row) => (
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModal(row)}
                  >
                    Visualizar
                  </Button>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/register-type-alert/${row.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              )}
            />
          )}
        </Paper>

        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Detalhes do Tipo de Alerta</DialogTitle>
          <DialogContent>
            {selectedAlert && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography><strong>ID:</strong> {selectedAlert.id}</Typography>
                <Typography><strong>Nome:</strong> {selectedAlert.name}</Typography>
                <Typography><strong>Valor:</strong> {selectedAlert.value}</Typography>
                <Typography><strong>Sinal Matemático:</strong> {selectedAlert.math_signal}</Typography>
                <Typography><strong>Status:</strong> {selectedAlert.status}</Typography>
                <Typography><strong>Data de Criação:</strong> {new Date(selectedAlert.create_date).toLocaleDateString()}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={handleCloseModal}>
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LoggedLayout>
  );
};

export default TypeAlertsPage;