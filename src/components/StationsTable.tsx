import React, { useState, useEffect, useCallback } from "react";
import DataTable from "./DataTable";
import { links } from "../services/api";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Paper,
  Stack,
  FormControlLabel,
  Checkbox,
  Typography,
  CircularProgress,
  Autocomplete,
} from "@mui/material";

interface Station {
  id: number;
  name_station: string;
  uid: string;
  address: string[];
  latitude: number;
  longitude: number;
  create_date: string;
}

const StationTable: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name_station: "",
    uid: "",
    status: true,
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verifica se o usuário está logado
  const isLoggedIn = !!localStorage.getItem("token");

  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await links.listStations(filters);
      if (response.success) {
        setStations(response.data.data);
      } else {
        setError(response.error || "Erro ao carregar as estações.");
      }
    } catch (err) {
      setError("Erro ao carregar as estações.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleSearch = () => {
    fetchStations();
  };

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack spacing={2}>
          {/* Filtros */}
          <Stack direction="row" spacing={2}>
            <Autocomplete
              fullWidth
              options={stations.map((station) => station.name_station)}
              inputValue={filters.name_station}
              onInputChange={(_, newInputValue) =>
                setFilters((prev) => ({ ...prev, name_station: newInputValue || "" }))
              }
              onChange={(_, selectedValue) =>
                setFilters((prev) => ({ ...prev, name_station: selectedValue || "" }))
              }
              renderInput={(params) => <TextField {...params} label="Buscar por nome" variant="outlined" size="small" />}
            />
            <Autocomplete
              fullWidth
              options={stations.map((station) => station.uid)}
              inputValue={filters.uid}
              onInputChange={(_, newInputValue) =>
                setFilters((prev) => ({ ...prev, uid: newInputValue || "" }))
              }
              onChange={(_, selectedValue) =>
                setFilters((prev) => ({ ...prev, uid: selectedValue || "" }))
              }
              renderInput={(params) => <TextField {...params} label="UID da estação" variant="outlined" size="small" />}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.checked }))}
                />
              }
              label="Ativo"
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "var(--purple-maincolor)" }}
                onClick={handleSearch}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                Buscar
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* Botão de Cadastrar - Apenas se estiver logado */}
      {isLoggedIn && (
        <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", mb: 2 }}>
          <Button variant="contained" color="success" onClick={() => navigate("/registrarestacao")}>
            Cadastrar
          </Button>
        </Box>
      )}

      {error && (
        <Box sx={{ mb: 2, color: "red" }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      <DataTable<Station>
        data={stations}
        columns={[
          { label: "UID", key: "uid" as keyof Station },
          { label: "Nome", key: "name_station" as keyof Station },
          { label: "Endereço", key: "address" as keyof Station },
          { label: "Latitude", key: "latitude" as keyof Station },
          { label: "Longitude", key: "longitude" as keyof Station },
          { label: "Data de criação", key: "create_date" as keyof Station },
        ]}
        loading={loading}
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
