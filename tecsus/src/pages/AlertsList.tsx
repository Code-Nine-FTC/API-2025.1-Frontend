import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import GenericTable, { Column } from "../components/table";
import { Alert } from "../store/alerts/state";
import { useAuth } from "../components/authContext";
import alertGetters from "../store/alerts/getters";

export interface AlertsTableProps {
  alerts: Alert[];
  loading: boolean;
  onSearch: (filters?: {
    typeAlertName: string;
    stationName: string;
    startDate: string;
  }) => Promise<void>;
}

export default function AlertsListPage({
  alerts,
  loading,
  onSearch,
}: AlertsTableProps) {
  const [typeAlertName, setTypeAlertName] = useState<string>("");
  const [stationName, setStationName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");

  const auth = useAuth();

  const handleSearch = () => {
    onSearch({ typeAlertName, stationName, startDate });
  };

  const handleResetFilters = () => {
    setTypeAlertName("");
    setStationName("");
    setStartDate("");
    onSearch({ typeAlertName: "", stationName: "", startDate: "" });
  };

  const displayedAlert = async (id: number) => {
    console.log("Displaying alert with ID:", id);
    const result = await alertGetters.alertDisplayed(id);
    if (result.success) {
      alerts.filter((alert) => alert.id !== id);
      handleResetFilters();
    } else {
      alert(`Erro ao visualizar o alerta: ${result.error}`);
    }
  };
  const columns: Column<Alert>[] = [
    { field: "type_alert_name", headerName: "Tipo de Alerta" },
    { field: "station_name", headerName: "Estação" },
    { field: "measure_value", headerName: "Valor Medido" },
    { field: "create_date", headerName: "Data do Alerta"},
  ];

  return (
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
          Alertas
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
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
          alignItems="center"
        >
          <TextField
            label="Tipo de Alerta"
            value={typeAlertName}
            onChange={(e) => setTypeAlertName(e.target.value)}
            fullWidth
            sx={{
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
          <TextField
            label="Nome da Estação"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            fullWidth
            sx={{
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
        </Box>
        <Box
          display="flex"
          justifyContent={{ xs: "center", sm: "flex-end" }}
          gap={2}
          mt={2}
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
            startIcon={<SearchIcon />}
            onClick={handleSearch}
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
      ) : alerts.length === 0 ? (
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
          rows={alerts}
          renderCell={(row, column) => {
            if (column.field === "create_date") {
              const date = new Date(row[column.field] as string);
              return date.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
            }
            return String(row[column.field]);
          }}
          renderActions={(row) => (
            <Box
              display="flex"
              gap={1}
              alignItems="center"
              justifyContent="center"
            >
              {auth.isAuthenticated && (
                <IconButton
                  sx={{
                    color: "rgb(146, 123, 230)",
                    "&:hover": {
                      backgroundColor: "rgba(146, 123, 230, 0.1)",
                    },
                  }}
                  onClick={() => displayedAlert(row.id)}
                >
                  <CheckIcon />
                </IconButton>
              )}
            </Box>
          )}
        />
      )}
    </Box>
  );
}
