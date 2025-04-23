import { useEffect, useState } from "react";
import { ListStationsFilters, ListStationsResponse } from "../store/station/state";
import stationGetters from "../store/station/getters";
import { LoggedLayout } from "../layout/layoutLogged";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import GenericTable, { Column } from "../components/table";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function StationsListPage() {
  const [stations, setStations] = useState<ListStationsResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [uid, setUid] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const navigate = useNavigate();
  const auth = useAuth();

  const columns: Column<ListStationsResponse>[] = [
    { field: "uid", headerName: "UID" },
    { field: "name_station", headerName: "Nome" },
    { field: "address", headerName: "Endereço" },
    { field: "latitude", headerName: "Latitude" },
    { field: "longitude", headerName: "Longitude" },
    { field: "create_date", headerName: "Data de criação" },
  ];

  async function getListStations() {
    try {
      const filters: ListStationsFilters = {};
      if (name.trim()) filters.name = name;
      if (uid.trim()) filters.uid = uid;
      if (isActive) filters.is_active = isActive;

      const response = await stationGetters.listStations(Object.keys(filters).length ? filters : undefined);
      if (response.success) {
        setStations(response.data as ListStationsResponse[]);
      } else {
        setError("Erro ao listar estações.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
    }
  }

  useEffect(() => {
    getListStations();
  }, []);

  function handleSearch() {
    getListStations();
  }

  function handleReset() {
    setName("");
    setUid("");
  }

  return (
    <LoggedLayout>
      <Box display={"flex"} flexDirection="column" gap={2} p={2} m={5}>
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
            }}
          >
            Estações Meteorológicas
          </Typography>
          {auth.isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon sx={{ fontSize: 22 }} />}
              onClick={() => navigate("/register-station")}
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
              Novo Cadastro
            </Button>
          )}
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
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
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              label="Nome da Estação"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
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
              label="UID"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              size="small"
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="Ativos"
              sx={{
                minWidth: { xs: "100%", sm: "auto" },
                ml: { xs: 0, sm: 1 },
                px: 2,
                py: 0.5,
              }}
            />
          </Box>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              variant="outlined"
              onClick={handleReset}
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
              color="primary"
              startIcon={<Search />}
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
          </Stack>
        </Paper>

        {stations.length === 0 ? (
          <Typography
            variant="h6"
            color="textSecondary"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            Nenhum registro encontrado.
          </Typography>
        ) : (
          <GenericTable
            columns={columns}
            rows={stations}
            renderCell={(row, column) => {
              if (column.field === "address") {
                const address = row.address;
                if (address) {
                  return `${address.city || ""}, ${address.state || ""}, ${address.country || ""}`;
                }
                return "";
              }
              if (column.field === "create_date") {
                return new Date(row[column.field] as string).toLocaleDateString();
              }
              return String(row[column.field]);
            }}
            renderActions={(row) => (
              <Button
                variant="outlined"
                onClick={() => navigate(`/view-station/${row.id}`)}
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
                Visualizar
              </Button>
            )}
          />
        )}
      </Box>
    </LoggedLayout>
  );
}