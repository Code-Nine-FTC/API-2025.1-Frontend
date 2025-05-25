import { useEffect, useState, useCallback } from "react";
import { ListStationsFilters, ListStationsResponse } from "../store/station/state";
import stationGetters from "../store/station/getters";
import FilterBox, { FilterField } from "../components/ui/FilterBox";
import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import GenericTable, { Column } from "../components/table";
import { AddCircleOutline as AddCircleOutlineIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";
import { LoggedLayout } from "../layout/layoutLogged"; // Layout com sidebar

export default function StationsListPage({onlyView = false} : {onlyView: boolean}) {
  const [stations, setStations] = useState<ListStationsResponse[]>([]);
  const [name, setName] = useState<string>("");
  const [uid, setUid] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const navigate = useNavigate();
  const auth = useAuth();

  const filters: FilterField[] = [
    {
      name: "name",
      label: "Nome da Estação",
      type: "autocomplete",
      value: name,
      onChange: (value) => setName(value),
      options: stations.map(station => ({ value: station.name_station, label: station.name_station })),
      fullWidth: true
    },
    {
      name: "uid",
      label: "UID",
      type: "autocomplete",
      value: uid,
      onChange: (value) => setUid(value),
      options: stations.map(station => ({ value: station.uid, label: station.uid })),
      fullWidth: true
    },
    {
      name: "isActive",
      label: isActive ? "Exibir Ativos" : "Exibir Inativos",
      type: "checkbox",
      value: isActive,
      onChange: (value) => {
        setIsActive(value)
        handleReset();
      }
    }
  ];

  const columns: Column<ListStationsResponse>[] = [
    { field: "uid", headerName: "UID" },
    { field: "name_station", headerName: "Nome" },
    { field: "address", headerName: "Endereço" },
    { field: "latitude", headerName: "Latitude" },
    { field: "longitude", headerName: "Longitude" },
    { field: "create_date", headerName: "Data de criação" },
  ];

  const getListStations = useCallback(async () => {
    try {
      const filters: ListStationsFilters = {};
      if (name.trim()) filters.name = name;
      if (uid.trim()) filters.uid = uid;
      if (isActive) filters.is_active = isActive;

      const response = await stationGetters.listStations(Object.keys(filters).length ? filters : undefined);
      if (response.success) {
        setStations(response.data as ListStationsResponse[]);
      } else {
        console.error("Erro ao listar estações.");
      }
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
    }
  }, [name, uid, isActive]);

  useEffect(() => {
    getListStations();
  }, [getListStations]);

  function handleSearch() {
    getListStations();
  }

  const handleReset = () => {
    setName("");
    setUid("");
    setIsActive(true);
  };

  const Content = (
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

        <FilterBox
          filters={filters}
          onSearch={handleSearch}
          onReset={handleReset}
        />
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
          tableName="Estações Meteorológicas"
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
  );

  return onlyView ? (
    <>{Content}</>
  ) : (
    <LoggedLayout>{Content}</LoggedLayout> 
  )
}