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
  Paper
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { Grid } from '@mui/material';

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
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const [showFilters, setShowFilters] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [uidFilter, setUidFilter] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {
          name: nameFilter || undefined,
          uid: uidFilter || undefined,
          start_date: startDate ? startDate.toISOString().split('T')[0] : undefined,
          end_date: endDate ? endDate.toISOString().split('T')[0] : undefined,
          page: page,
          limit: limit
        };
        
        const response = await links.listStations(filters);
        if (response.success) {
          setStations(response.data);
          setFilteredStations(response.data);
        } else {
          setError(response.error || "Erro ao carregar as estações.");
        }
      } catch (err) {
        setError("Erro ao carregar as estações.");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();

    setLoading(true);
  }, [page, limit]);

  const handleSearch = () => {
    const fetchWithFilters = async () => {
      setLoading(true);
      const filters = {
        name: nameFilter || undefined,
        uid: uidFilter || undefined,
        start_date: startDate ? startDate.toISOString().split('T')[0] : undefined,
        end_date: endDate ? endDate.toISOString().split('T')[0] : undefined,
        page: 1, 
        limit: limit
      };
      
      try {
        const response = await links.listStations(filters);
        if (response.success) {
          setStations(response.data);
          setFilteredStations(response.data);
          setPage(1);
        } else {
          setError(response.error || "Erro ao buscar estações.");
        }
      } catch (err) {
        setError("Erro ao buscar estações.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchWithFilters();
  };

  const clearFilters = () => {
    setNameFilter("");
    setUidFilter("");
    setStartDate(null);
    setEndDate(null);
    setPage(1);
    
    const fetchAllStations = async () => {
      setLoading(true);

      try {
        const response = await links.listStations({ page: 1, limit });
        if (response.success) {
          setStations(response.data);
          setFilteredStations(response.data);
        } else {
          setError(response.error || "Erro ao carregar as estações.");
        }
      } catch (err) {
        setError("Erro ao carregar as estações.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllStations();
  };

  const columns = [
    { label: "UID", key: "uid" as keyof Station },
    { label: "Nome", key: "name" as keyof Station },
    { label: "Endereço", key: "address" as keyof Station },
    { label: "Latitude", key: "latitude" as keyof Station },
    { label: "Longitude", key: "longitude" as keyof Station },
    { label: "Última atualzição", key: "last_update" as keyof Station },
  ];

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSearch}
                sx={{ flexGrow: 1 }}
                className="data-table-button"
              >
                Buscar
              </Button>
              <IconButton 
                color="primary" 
                onClick={() => setShowFilters(!showFilters)}
                aria-label="toggle filters"
              >
                <FilterListIcon />
              </IconButton>
              <IconButton 
                color="secondary" 
                onClick={clearFilters}
                aria-label="clear filters"
              >
                <ClearIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="success" 
              onClick={() => navigate("/registrarestacao")}
              startIcon={<SearchIcon />}
            >
              Cadastrar
            </Button>
          </Grid>
        </Grid>
        
        {/* Advanced Filters */}
        <Collapse in={showFilters}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Filtros avançados</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="UID da estação"
                  value={uidFilter}
                  onChange={(e) => setUidFilter(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                  <DatePicker
                    label="Data inicial"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                  <DatePicker
                    label="Data final"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
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
        </Collapse>
      </Paper>
      
      {/* Data Table */}
      <DataTable<Station>
        data={filteredStations}
        columns={columns}
        loading={loading}
        error={error}
        title=""
        renderActions={(row) => (
          <SearchIcon
            style={{ color: "#ccc", cursor: "pointer" }}
            onClick={() => navigate(`/station-details/${row.id}`)}
          />
        )}
      />
      
      {/* Pagination Controls */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2">
          Página {page} de {Math.ceil(stations.length / limit)}
        </Typography>
        <Button 
          disabled={page === 1} 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          variant="outlined"
          size="small"
        >
          Anterior
        </Button>
        <Button 
          disabled={page >= Math.ceil(stations.length / limit)} 
          onClick={() => setPage(p => p + 1)}
          variant="outlined"
          size="small"
        >
          Próxima
        </Button>
      </Box>
    </Box>
  );
};

export default StationTable;