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
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";

function TypeParametersList() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [typeParameters, setTypeParameters] = useState<ParameterTypesResponse[]>([]);
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

  const handleFilter = useCallback(async () => {
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
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
    }
  }, [name, showInactive]);

  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  async function handleDelete(id: number) {
    try {
      const response = await typeParameterGetters.deleteParameterType(id);
      if (response.success) {
        setTypeParameters((prev) => prev.filter((typeParameter) => typeParameter.id !== id));
      } else {
        setError("Erro ao excluir tipo de parâmetro.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
    }
  }

  return (
    <LoggedLayout>
      <Box display={"flex"} flexDirection="column" gap={2} p={2} m={5}>
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
            Tipos de Parâmetros
          </Typography>
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
              textAlign: "center",
              "&:hover": {
                background:
                  "linear-gradient(45deg, rgb(126, 103, 210) 30%, rgb(106, 83, 190) 90%)",
              },
            }}
          >
            Novo Cadastro
          </Button>
        </Box>

        <Paper sx={{ p: 2 }}>
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
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            gap={3}
            sx={{ mb: 2 }}
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
                    borderColor: "rgb(146, 123, 230)",
                  },
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid",
                borderColor: "rgba(146, 123, 230, 0.5)",
                borderRadius: "8px",
                px: 2,
                py: 0.8,
                height: "56px",
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
                  minWidth: "100px",
                  textAlign: "center",
                }}
              >
                {showInactive ? "Exibir Ativos" : "Exibir Inativos"}
              </Typography>
              <Switch
                checked={showInactive}
                onChange={(e) => {
                  const newShowInactive = e.target.checked;
                  setShowInactive(newShowInactive);
                  handleFilter();
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
          <Box
            display="flex"
            gap={2}
            justifyContent={{ xs: "center", sm: "flex-end" }}
            sx={{
              width: "100%",
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setName("");
                handleFilter();
              }}
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
              onClick={handleFilter}
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
          </Box>
        </Paper>

        {typeParameters.length === 0 ? (
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
              <Box display="flex" gap={1} alignItems="center" justifyContent="center">
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/view-type-parameter/${row.id}`)}
                  sx={{
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
              </Box>
            )}
          />
        )}
      </Box>
    </LoggedLayout>
  );
}
export default TypeParametersList;