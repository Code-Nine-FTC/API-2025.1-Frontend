import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GenericTable, { Column } from "../components/table";
import typeAlertGetters from "../store/typealerts/getters";
import { AlertTypeResponse } from "../store/typealerts/state";
import { LoggedLayout } from "../layout/layoutLogged";
import { useNavigate } from "react-router-dom";

const TypeAlertsPage = () => {
  const [typeAlerts, setTypeAlerts] = useState<AlertTypeResponse[]>([]);
  const [filteredTypeAlerts, setFilteredTypeAlerts] = useState<AlertTypeResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [nameFilter, setNameFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

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
        setFilteredTypeAlerts(response.data);
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
    setFilteredTypeAlerts(typeAlerts);
  };

  const columns: Column<AlertTypeResponse>[] = [
    { field: "status", headerName: "Status" },
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Nome" },
    { field: "value", headerName: "Valor" },
    { field: "math_signal", headerName: "Sinal Matemático" },
    { field: "create_date", headerName: "Data de Criação" },
  ];

  return (
    <LoggedLayout>
      <Box display={"flex"} flexDirection="column" gap={2} p={2} m={5}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "var(--purple-maincolor)",
              fontWeight: "bold",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Tipos de Alertas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon sx={{ fontSize: 22 }} />}
            onClick={() => navigate("/register-type-alert")}
            sx={{
              minHeight: 42,
              borderRadius: "8px",
              px: 3,
              py: 1.2,
              fontSize: "0.95rem",
              fontWeight: 600,
              background:
                "linear-gradient(45deg, rgb(146, 123, 230) 30%, rgb(126, 103, 210) 90%)",
              color: "#fff",
              "&:hover": {
                background:
                  "linear-gradient(45deg, rgb(126, 103, 210) 30%, rgb(106, 83, 190) 90%)",
              },
            }}
          >
            Novo Cadastrar
          </Button>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Typography
            variant="h6"
            mb={2}
            sx={{
              color: "gray",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Filtros de Busca
          </Typography>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={2}
            width="100%"
            sx={{ mb: 2 }}
          >
            <TextField
              label="Pesquisar Tipo de Alerta"
              name="nameFilter"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "rgb(146, 123, 230)",
                  "&:hover": {
                    backgroundColor: "rgb(146, 123, 230)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgb(146, 123, 230)",
                  },
                },
              }}
            />

            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              flexShrink={0}
            >
              <Button
                variant="outlined"
                onClick={handleResetFilters}
                sx={{
                  borderRadius: "8px",
                  fontWeight: "bold",
                  color: "rgb(146, 123, 230)",
                  borderColor: "rgb(146, 123, 230)",
                  "&:hover": {
                    backgroundColor: "rgba(146, 123, 230, 0.1)",
                    borderColor: "rgb(146, 123, 230)",
                  },
                }}
              >
                Limpar
              </Button>
              <Button
                variant="contained"
                onClick={applyFilters}
                startIcon={<SearchIcon />}
                sx={{
                  borderRadius: "8px",
                  fontWeight: "bold",
                  backgroundColor: "rgb(146, 123, 230)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgb(126, 103, 210)",
                  },
                }}
              >
                Buscar
              </Button>
            </Box>
          </Box>
        </Paper>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : filteredTypeAlerts.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <Typography variant="h6" color="textSecondary">
              Nenhum registro encontrado.
            </Typography>
          </Box>
        ) : (
          <GenericTable
            columns={columns}
            rows={filteredTypeAlerts}
            renderCell={(row, column) => {
              if (column.field === "create_date") {
                const timestamp = Number(row[column.field]);
                return isNaN(timestamp)
                  ? "Data inválida"
                  : new Date(timestamp * 1000).toLocaleDateString();
              }

              if (column.field === "status") {
                const status = row[column.field];
                let color = "gray";

                if (status === "A") color = "grey";
                else if (status === "Y") color = "#FFD700";
                else if (status === "G") color = "green";
                else if (status === "R") color = "red";

                return (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    gap={1}
                  >
                    <Box
                      width={15}
                      height={15}
                      borderRadius="50%"
                      sx={{ backgroundColor: color }}
                    />
                  </Box>
                );
              }

              return String(row[column.field]);
            }}
            renderActions={(row) => (
              <Box display="flex" gap={1} alignItems="center" justifyContent="center">
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/view-type-alert/${row.id}`)}
                  sx={{
                    fontWeight: "bold",
                    color: "rgb(146, 123, 230)",
                    borderColor: "rgb(146, 123, 230)",
                    "&:hover": {
                      backgroundColor: "rgba(146, 123, 230, 0.1)",
                      borderColor: "rgb(146, 123, 230)",
                    },
                  }}
                >
                  Visualizar
                </Button>
              </Box>
            )}
          />
        )}
      </Box>
    </LoggedLayout>
  );
};

export default TypeAlertsPage;
