import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GenericTable, { Column } from "../components/table";
import { Alert } from "../store/alerts/state";

interface AlertsTableProps {
  alerts: Alert[];
  loading: boolean;
  onSearch: (filters: { typeAlertName: string; stationName: string; startDate: string }) => void;
}

export default function AlertsListPage({ alerts, loading, onSearch }: AlertsTableProps) {
  const [typeAlertName, setTypeAlertName] = useState<string>("");
  const [stationName, setStationName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");

  const handleSearch = () => {
    onSearch({ typeAlertName, stationName, startDate });
  };

  const handleResetFilters = () => {
    setTypeAlertName("");
    setStationName("");
    setStartDate("");
    onSearch({ typeAlertName: "", stationName: "", startDate: "" });
  };

  const columns: Column<Alert>[] = [
    { field: "type_alert_name", headerName: "Tipo de Alerta" },
    { field: "station_name", headerName: "Estação" },
    { field: "measure_value", headerName: "Valor Medido" },
    { field: "create_date", headerName: "Data de Criação" },
  ];

  return (
    <Box display={"flex"} flexDirection="column" gap={2} p={2} m={5}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "var(--purple-maincolor)", fontWeight: "bold" }}
      >
        Alertas
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros de Busca
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={2}>
            <TextField
              label="Tipo de Alerta"
              value={typeAlertName}
              onChange={(e) => setTypeAlertName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Nome da Estação"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              fullWidth
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              label="Data Inicial"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={handleResetFilters}>
              Limpar
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              Buscar
            </Button>
          </Box>
        </Box>
      </Paper>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <GenericTable
            columns={columns}
            rows={alerts}
            renderCell={(row, column) => {
              if (column.field === "create_date") {
                return new Date(row[column.field] as string).toLocaleDateString();
              }
              return String(row[column.field]);
            }}
            renderActions={(row) => (
              <Button
                variant="outlined"
                onClick={() => console.log("Visualizar alerta:", row)}
              >
                Visualizar
              </Button>
            )}
          />
        )}
    </Box>
  );
}