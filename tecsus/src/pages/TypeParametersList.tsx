/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
import FilterBox, { FilterField } from "../components/ui/FilterBox";

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
    { field: "offset", headerName: "OffSet" },
    { field: "factor", headerName: "Factor" },
    { field: "detect_type", headerName: "Sigla" },
  ];

  const filterFields: FilterField[] = [
    {
      name: "name",
      label: "Pesquisar Tipo de Parâmetro",
      type: "text",
      value: name,
      onChange: (value) => setName(value),
      options: typeParameters.map((type) => ({
        value: type.name,
        label: type.name,
      })),
      fullWidth: true
    },
    {
      name: "showInactive",
      label: showInactive ? "Exibir Ativos" : "Exibir Inativos",
      type: "checkbox",
      value: showInactive,
      onChange: (value) => {
        setShowInactive(value);
        handleFilter();
      },
    }
  ];

  const handleFilter = useCallback(async () => {
    try {
      const filtersObj: ListParameterTypesFilters = {};
      if (name && name.trim() !== "") {
        filtersObj.name = name;
      }
      filtersObj.is_active = showInactive;
      setFilters(filtersObj);
      const response = await typeParameterGetters.listParameterTypes(filtersObj);
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
  
  const handleReset = () => {
    setName("");
    setShowInactive(true);
    handleFilter();
  };

  return (
    <LoggedLayout>
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

          <FilterBox
            filters={filterFields}
            onSearch={handleFilter}
            onReset={handleReset}
          />
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
            tableName="Tipos de Parâmetros"
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