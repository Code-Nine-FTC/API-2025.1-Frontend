import { useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import GenericTable, { Column } from "../components/table";
import { Alert } from "../store/alerts/state";
import { useAuth } from "../components/authContext";
import alertGetters from "../store/alerts/getters";
import FilterBox, { FilterField } from "../components/ui/FilterBox";

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

  const uniqueAlertTypes = [...new Set(alerts.map(alert => alert.type_alert_name))].map(type => ({
    value: type,
    label: type
  }));
  
  const uniqueStations = [...new Set(alerts.map(alert => alert.station_name))].map(station => ({
    value: station,
    label: station
  }));

  const columns: Column<Alert>[] = [
    { field: "type_alert_name", headerName: "Tipo de Alerta" },
    { field: "station_name", headerName: "Estação" },
    { field: "measure_value", headerName: "Valor Medido" },
    { field: "create_date", headerName: "Data do Alerta"},
  ];

  const filters: FilterField[] = [
    {
      name: "typeAlertName",
      label: "Tipo de Alerta",
      type: "select",
      value: typeAlertName,
      onChange: (value) => setTypeAlertName(value),
      options: uniqueAlertTypes,
      fullWidth: true
    },
    {
      name: "stationName",
      label: "Nome da Estação",
      type: "select",
      value: stationName,
      onChange: (value) => setStationName(value),
      options: uniqueStations,
      fullWidth: true
    }
  ];

  return (
    <Box display={"flex"} flexDirection="column" gap={2} p={2} m={5}>

      <Paper sx={{ p: 3, mb: 3 }}>
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
        <FilterBox
          filters={filters}
          onSearch={handleSearch}
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
          tableName="Alertas"
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
