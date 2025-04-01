import React, { useState, useEffect, useCallback } from "react";
import DataTable from "./DataTable";
import { links } from "../services/api";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import "../pages/styles/registerstation.css"
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
  Grid,
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
  const [filteredStations, setFilteredStations] = useState<Station[]>([]); // Novo estado para estações filtradas
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name_station: "",
    uid: "",
    status: true,
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await links.listStations();
      if (response.success) {
        setStations(response.data.data);
        setFilteredStations(response.data.data); // Inicialmente, todas as estações são exibidas
      } else {
        setError(response.error || "Erro ao carregar as estações.");
      }
    } catch (err) {
      setError("Erro ao carregar as estações.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStationsByUid = useCallback(async (uid: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await links.listStations({ uid });
      if (response.success) {
        setStations(response.data.data);
        setFilteredStations(response.data.data); // Atualiza com os resultados do back-end
      } else {
        setError(response.error || "Erro ao carregar as estações.");
      }
    } catch (err) {
      setError("Erro ao carregar as estações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  // Filtrar estações no front-end por nome
  useEffect(() => {
    const filtered = stations.filter((station) =>
      station.name_station.toLowerCase().includes(filters.name_station.toLowerCase())
    );
    setFilteredStations(filtered);
  }, [filters.name_station, stations]);

  // Busca por UID no back-end
  useEffect(() => {
    if (filters.uid) {
      fetchStationsByUid(filters.uid);
    } else {
      fetchStations(); // Recarrega todas as estações se o UID for limpo
    }
  }, [filters.uid, fetchStations, fetchStationsByUid]);

  const handleSearch = () => {
    // Apenas força a atualização do filtro
    setFilters((prev) => ({ ...prev }));
  };

  return (
    <Box sx={{ mb: 4 }} className={"list-box"}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack spacing={2}>
          {/* Filtros */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                fullWidth
                options={stations.map((station) => station.name_station)}
                inputValue={filters.name_station}
                onInputChange={(_, newInputValue) =>
                  setFilters((prev) => ({ ...prev, name_station: newInputValue }))
                }
                onChange={(_, selectedValue) =>
                  setFilters((prev) => ({ ...prev, name_station: selectedValue || "" }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar por nome"
                    variant="outlined"
                    size="small"
                    sx={{
                      input: { fontSize: "14px" },
                      label: { fontSize: "12px" },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="UID da estação"
                    variant="outlined"
                    size="small"
                    sx={{
                      input: { fontSize: "14px" },
                      label: { fontSize: "12px" },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.status}
                    onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.checked }))}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: "18px",
                      },
                    }}
                  />
                }
                label="Ativo"
                sx={{ fontSize: "12px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "var(--purple-maincolor)",
                    fontSize: "14px",
                    padding: "6px 12px",
                  }}
                  onClick={handleSearch}
                  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                >
                  Buscar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      {/* Botão de Cadastrar - Apenas se estiver logado */}
      {isLoggedIn && (
        <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", mb: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/registrarestacao")}
            sx={{
              fontSize: "14px",
              padding: "6px 12px",
            }}
          >
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
        data={filteredStations} // Use as estações filtradas
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
