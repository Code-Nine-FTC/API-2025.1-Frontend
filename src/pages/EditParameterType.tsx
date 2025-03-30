import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { LoggedLayout } from "../components/layout/layoutLogged"; 

const EditParameterType: React.FC = () => {
  const { parameterTypeId } = useParams<{ parameterTypeId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    measureUnit: "",
    qntDecimals: 0,
    offset: 0,
    factor: 0,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch parameter type data
  useEffect(() => {
    const fetchParameterType = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/parameter_types/${parameterTypeId}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Erro ao carregar os dados do tipo de parâmetro:", error);
        alert("Erro ao carregar os dados do tipo de parâmetro.");
      } finally {
        setLoading(false);
      }
    };

    fetchParameterType();
  }, [parameterTypeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/parameter-types/${parameterTypeId}`, formData);
      alert("Tipo de parâmetro atualizado com sucesso!");
      navigate("/listartipoparametro"); // Redireciona para a lista de tipos de parâmetros
    } catch (error) {
      console.error("Erro ao atualizar o tipo de parâmetro:", error);
      alert("Erro ao atualizar o tipo de parâmetro.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LoggedLayout>
    <Box sx={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Editar Tipo de Parâmetro
      </Typography>
      <TextField
        label="Nome"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Unidade de Medida"
        name="measureUnit"
        value={formData.measureUnit}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Quantidade de Decimais"
        name="qntDecimals"
        type="number"
        value={formData.qntDecimals}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Offset"
        name="offset"
        type="number"
        value={formData.offset}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Fator"
        name="factor"
        type="number"
        value={formData.factor}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={saving}
        sx={{ backgroundColor: "#4caf50", color: "white" }}
      >
        {saving ? "Salvando..." : "Salvar"}
      </Button>
    </Box>
    </LoggedLayout>
  );
};

export default EditParameterType;