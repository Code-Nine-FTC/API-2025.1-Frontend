import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { links } from "../services/api";
import { Modal, Box, Typography, CircularProgress, Button, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { useNavigate } from "react-router-dom";

interface ParameterType {
  id: number;
  name: string;
  measureUnit: string;
  qntDecimals: number;
  offset?: number;
  factor?: number;
}

const ParameterTypeList: React.FC = () => {
  const [parameterTypes, setParameterTypes] = useState<ParameterType[]>([]);
  const [filteredParameterTypes, setFilteredParameterTypes] = useState<ParameterType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParameterType, setSelectedParameterType] = useState<ParameterType | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();

  const fetchParameterTypes = async (filters?: { [key: string]: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await links.listParameterTypes(filters || {});
      if (response.success) {
        const parameterTypesData =
          response.data?.map((item: any) => ({
            id: item.id,
            name: item.name,
            measureUnit: item.measure_unit,
            qntDecimals: item.qnt_decimals,
            offset: item.offset,
            factor: item.factor,
          })) || [];
        setParameterTypes(parameterTypesData);
        setFilteredParameterTypes(parameterTypesData);
      } else {
        setError(response.error || "Erro ao carregar os tipos de parâmetros.");
      }
    } catch (err) {
      setError("Erro ao carregar os tipos de parâmetros.");
    } finally {
      setLoading(false);
    }
  };

  const fetchParameterTypeDetails = (parameterTypeId: number) => {
    setModalLoading(true);
    setError(null);

    try {
      const parameterType = parameterTypes.find((item) => item.id === parameterTypeId);

      if (parameterType) {
        setSelectedParameterType(parameterType);
        setModalOpen(true);
      } else {
        setError("Tipo de parâmetro não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar os detalhes do tipo de parâmetro:", err);
      setError("Erro ao carregar os detalhes do tipo de parâmetro.");
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchParameterTypes();
  }, []);

  const handleSearch = () => {
    const filters: { [key: string]: string } = {};
    if (nameFilter.trim()) filters.name = nameFilter;

    fetchParameterTypes(filters);
  };

  const handleEditClick = (parameterTypeId: number) => {
    navigate(`/editarparametrotipo/${parameterTypeId}`);
  };

  const handleRegisterClick = () => {
    navigate("/registrarparametro");
  };

  const columns = [
    { label: "ID", key: "id" as keyof ParameterType },
    { label: "Nome", key: "name" as keyof ParameterType },
    { label: "Unidade de Medida", key: "measureUnit" as keyof ParameterType },
    { label: "Quantidade de Decimais", key: "qntDecimals" as keyof ParameterType },
    { label: "Offset", key: "offset" as keyof ParameterType },
    { label: "Fator", key: "factor" as keyof ParameterType },
  ];

  return (
    <LoggedLayout>
      <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Typography
          variant="h4"
          sx={{
            marginBottom: "20px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#5f5cd9",
          }}
        >
          Tipos de Parâmetros
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
          <TextField
            label="Filtrar por nome"
            variant="outlined"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{ backgroundColor: "#5f5cd9", color: "white", height: "56px" }}
          >
            Buscar
          </Button>
          <Button
            variant="contained"
            onClick={handleRegisterClick}
            startIcon={<AddIcon />}
            sx={{ backgroundColor: "#4caf50", color: "white", height: "56px" }}
          >
           Cadastrar
          </Button>
        </Box>
        <DataTable<ParameterType>
          data={filteredParameterTypes}
          columns={columns}
          loading={loading}
          error={error}
          renderActions={(row) => (
            <Box sx={{ display: "flex", gap: "10px" }}>
              <SearchIcon
                sx={{ color: "#5f5cd9", cursor: "pointer" }}
                onClick={() => fetchParameterTypeDetails(row.id)}
              />
              <EditIcon
                sx={{ color: "#4caf50", cursor: "pointer" }}
                onClick={() => handleEditClick(row.id)}
              />
            </Box>
          )}
        />
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "500px",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {modalLoading ? (
              <CircularProgress />
            ) : selectedParameterType ? (
              <div>
                <Typography variant="h6" component="h2" sx={{ marginBottom: "16px" }}>
                  Detalhes do Tipo de Parâmetro
                </Typography>
                <Typography><strong>ID:</strong> {selectedParameterType.id}</Typography>
                <Typography><strong>Nome:</strong> {selectedParameterType.name}</Typography>
                <Typography><strong>Unidade de Medida:</strong> {selectedParameterType.measureUnit}</Typography>
                <Typography><strong>Quantidade de Decimais:</strong> {selectedParameterType.qntDecimals}</Typography>
                <Typography><strong>Offset:</strong> {selectedParameterType.offset || "N/A"}</Typography>
                <Typography><strong>Fator:</strong> {selectedParameterType.factor || "N/A"}</Typography>
              </div>
            ) : (
              <Typography>Erro ao carregar os detalhes do tipo de parâmetro.</Typography>
            )}
          </Box>
        </Modal>
      </Box>
    </LoggedLayout>
  );
};

export default ParameterTypeList;