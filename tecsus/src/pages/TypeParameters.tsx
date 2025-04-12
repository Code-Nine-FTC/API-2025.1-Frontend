import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Switch,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { LoggedLayout } from "../layout/layoutLogged";
import GenericTable, { Column } from "../components/table";
import typeParameterGetters from "../store/typeparameters/getters";
import {
  ParameterTypesResponse,
  ListParameterTypesFilters,
} from "../store/typeparameters/state";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";

function TypeParametersPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [typeParameters, setTypeParameters] = useState<
    ParameterTypesResponse[]
  >([]);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(true);
  const [filters, setFilters] = useState<ListParameterTypesFilters>();
  const columns: Column<ParameterTypesResponse>[] = [
    { field: "name", headerName: "Nome" },
    { field: "measure_unit", headerName: "Unidade de Medida" },
    { field: "qnt_decimals", headerName: "Quantidade de Decimais" },
    { field: "offset", headerName: "OffSett" },
    { field: "factor", headerName: "Factor" },
    { field: "json", headerName: "JSON" },
  ];

  useEffect(() => {
    getListTypeParameter();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [showInactive]);

  async function getListTypeParameter() {
    try {
      const response = await typeParameterGetters.listParameterTypes();
      if (response.success) {
        setTypeParameters(response.data as ParameterTypesResponse[]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro desconhecido"
      );
    }
  }

  async function handleFilter() {
    try {
      const filters: ListParameterTypesFilters = {};
      if (name && name.trim() !== "") {
        filters.name = name;
      }
      filters.is_active = showInactive;
      setFilters(filters);
      const response = await typeParameterGetters.listParameterTypes(filters);
      if (response.success) {
        setTypeParameters(response.data as ParameterTypesResponse[]);
      } else {
        setError("Erro ao listar tipos de parâmetros.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro desconhecido"
      );
    }
  }

  return (
    <LoggedLayout>
      <Box display={"flex"} flexDirection="column" gap={2} p={2} m={5}>
        <Box
          sx={{
            maxWidth: 600,
            "& .MuiTypography-h4": {
              fontWeight: 700,
              color: "primary.main",
            },
          }}
        >
          <Typography variant="h4" >Tipos de Parâmetros</Typography>
        </Box>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={2} sx={{ color: "gray" }}>
            Filtros de Busca
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={3}
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              mb: 2,
            }}  
          >
            <TextField
              label="Pesquisar Tipo de Parâmetro"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "rgb(146, 123, 230)",
                  "&:hover": {
                    backgroundColor: "rgb(146, 123, 230)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgb(146, 123, 230)", // cor da linha ao passar o mouse
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={handleFilter}
                    variant="contained"
                    sx={{
                      backgroundColor: "transparent",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      },
                      minWidth: 0,
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 22, color: "white" }} />
                  </Button>
                ),
              }}
            />

            <Box
              display="flex"
              gap={2}
              sx={{
                flexShrink: 0,
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "flex-end", sm: "normal" },
              }}
            >
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
                }}
              >
                Novo Cadastro
              </Button>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: "rgba(146, 123, 230, 0.5)",
                  borderRadius: "8px",
                  px: 2,
                  py: 0.8,
                  backgroundColor: "rgba(146, 123, 230, 0.05)",
                  backdropFilter: "blur(8px)",
                  boxShadow: (theme) => theme.shadows[1],
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "rgba(146, 123, 230, 0.5)",
                    boxShadow: (theme) => theme.shadows[1],
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mr: 1.5,
                    color: "text.secondary",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {showInactive ? "Exibir Ativos" : "Exibir Inativos"}
                </Typography>
                <Switch
                  checked={showInactive}
                  onChange={(e) => {
                    handleFilter();
                    setShowInactive(e.target.checked);
                  }}
                  color="primary"
                  size="medium"
                  sx={{
                    "& .MuiSwitch-track": {
                      borderRadius: 20,
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                    "& .MuiSwitch-thumb": {
                      width: 16,
                      height: 16,
                      backgroundColor: "rgb(146, 123, 230)",
                      boxShadow: (theme) => theme.shadows[1],
                    },
                    "&.Mui-checked": {
                      "& .MuiSwitch-thumb": {
                        backgroundColor: "rgb(146, 123, 230)",
                      },
                      "& + .MuiSwitch-track": {
                        backgroundColor: "rgba(146, 123, 230, 0.3)",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
        <Box>
          <GenericTable
            columns={columns}
            rows={typeParameters}
            renderActions={(row) => (
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => navigate(`/view-station/${row.id}`)}
                sx={{
                  borderRadius: "8px",
                  borderColor: "rgb(39, 235, 65)",
                  color: "rgb(39, 235, 65)",
                  textTransform: "none",
                  px: 2.5,
                  py: 1,
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: "rgb(39, 235, 65)",
                    color: "rgb(39, 235, 65)",
                  },
                }}
              >
                Detalhes
              </Button>
            )}
          />
        </Box>
      </Box>
    </LoggedLayout>
  );
}
export default TypeParametersPage;
