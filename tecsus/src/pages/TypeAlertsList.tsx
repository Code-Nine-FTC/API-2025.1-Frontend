import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GenericTable, { Column } from "../components/table";
import typeAlertGetters from "../store/typealerts/getters";
import { AlertTypeResponse } from "../store/typealerts/state";
import { LoggedLayout } from "../layout/layoutLogged";
import { useNavigate } from "react-router-dom";
import FilterBox, { FilterField } from "../components/ui/FilterBox";

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

  const filters: FilterField[] = [
    {
      name: "nameFilter",
      label: "Pesquisar Tipo de Alerta",
      type: "text",
      value: nameFilter,
      onChange: (value) => setNameFilter(value),
      options: typeAlerts.map((alert) => ({
        value: alert.name,
        label: alert.name,
      })),
      fullWidth: true
    },
    {
      name: "statusFilter",
      label: "Status",
      type: "select",
      value: statusFilter,
      onChange: (value) => setStatusFilter(value),
      options: [
        { value: "G", label: "Seguro" },
        { value: "Y", label: "Risco Moderado" },
        { value: "R", label: "Risco Alto" }
      ],
      fullWidth: true
    }
  ];

  return (
    <LoggedLayout>
      <Box display={"flex"} flexDirection="column" gap={2} p={2} m={5}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "var(--purple-maincolor)",
                fontWeight: "bold",
                textAlign: { xs: "center", sm: "left" },
                mb: { sm: 0 }
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

          <FilterBox
            filters={filters}
            onSearch={applyFilters}
            onReset={handleResetFilters}
          />
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
            tableName="Tipos de Alertas"
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
                      width={20}
                      height={20}
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
