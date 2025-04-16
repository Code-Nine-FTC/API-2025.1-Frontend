import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Switch,
  TextField,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
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
    { field: "detect_type", headerName: "Sigla" },
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
      console.log(response.data);
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

  async function handleDelete(id: number) {
    try {
      const response = await typeParameterGetters.deleteParameterType(id);
      if (response.success) {
        setTypeParameters((prev) =>
          prev.filter((typeParameter) => typeParameter.id !== id)
        );
      } else {
        setError("Erro ao excluir tipo de parâmetro.");
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
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            sx={{
              maxWidth: 600,
              "& .MuiTypography-h4": {
                fontWeight: 700,
                color: "primary.main",
              },
            }}
          >
            <Typography variant="h4">Tipos de Parâmetros</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon sx={{ fontSize: 22 }} />}
            onClick={() => navigate("/register-parameter-type")}
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
            renderCell={(row, column) => {
              if (column.field === "offset") {
                return row.offset !== undefined ? row.offset : "Não Definido";
              }
              if (column.field === "factor") {
                return row.factor !== undefined ? row.factor : "Não Definido";
              }
              if (column.field === "detect_type") {
                return row.detect_type !== undefined
                  ? row.detect_type
                  : "Não Definido";
              }
              return String(row[column.field]);
            }}
            renderActions={(row) => (
              <>
                <Box display="flex" gap={1} alignItems={"center"}>
                  <IconButton
                    onClick={() => navigate(`/view-station/${row.id}`)}
                    sx={{
                      color: "rgb(39, 235, 65)",
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => handleDelete(row.id)}
                    sx={{
                      color: "red",
                      "&:hover": {
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </>
            )}
          />
        </Box>
      </Box>
    </LoggedLayout>
  );
}
export default TypeParametersPage;
