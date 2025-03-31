import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import { links } from "../services/api";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import dayjs, { Dayjs } from "dayjs";

interface Station {
  id: number;
  name: string;
  uid: string;
  address: string[];
  latitude: Number;
  longitude: Number;
  last_update: string;
}

const StationTable: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [uidFilter, setUidFilter] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [status, setStatus] = useState(false);
  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const fetchStations = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        name: nameFilter || undefined,
        uid: uidFilter || undefined,
        status: status || undefined,
      };

      const response = await links.listStations(filters);
      if (response.success) {
        setStations(response.data.data);
        console.log("anhian ", stations);
      } else {
        setError(response.error || "Erro ao carregar as estações.");
      }
    } catch (err) {
      setError("Erro ao carregar as estações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleSearch = () => {
    fetchStations();
  };

  const clearFilters = () => {
    setNameFilter("");
    setUidFilter("");
    setStartDate(null);
    setEndDate(null);
    setLimit(10);
  };

  const columns = [
    { label: "UID", key: "uid" as keyof Station },
    { label: "Nome", key: "name_station" as keyof Station },
    { label: "Endereço", key: "address" as keyof Station },
    { label: "Latitude", key: "latitude" as keyof Station },
    { label: "Longitude", key: "longitude" as keyof Station },
    { label: "Data de criação", key: "create_date" as keyof Station },
  ];

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      {/* Filtros dentro da caixa branca */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Buscar por nome"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="UID da estação"
              value={uidFilter}
              onChange={(e) => setUidFilter(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                    color="primary"
                  />
                }
                label="Estações ativas"
              />
              <IconButton
                color="secondary"
                onClick={clearFilters}
                aria-label="clear filters"
              >
                <ClearIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Filtros avançados
        <Collapse in={showFilters}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                >
                  <DatePicker
                    label="Data inicial"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                >
                  <DatePicker
                    label="Data final"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Resultados por página</InputLabel>
                  <Select
                    value={limit}
                    label="Resultados por página"
                    onChange={(e) => setLimit(Number(e.target.value))}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Collapse> */}
      </Paper>

      {/* Botões fora da caixa branca */}
      <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Buscar
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/registrarestacao")}
        >
          + Cadastrar
        </Button>
      </Box>

      {/* Data Table */}
      <DataTable<Station>
        data={stations}
        columns={columns}
        loading={loading}
        error={error}
        title="Estações"
        renderActions={(row) => (
          <SearchIcon
            style={{ color: "#ccc", cursor: "pointer" }}
            onClick={() => navigate(`/visualizarestacao/${row.id}`)}
          />
        )}
      />
    </Box>
  );
};

export default StationTable;