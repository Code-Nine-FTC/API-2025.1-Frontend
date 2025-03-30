import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material";
import { links } from "../services/api"; // Importa o serviço com o método updateParameterType
import { LoggedLayout } from "../components/layout/layoutLogged";

const EditParameterType = () => {
  const { parameterTypeId } = useParams<{ parameterTypeId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    measure_unit: "",
    qnt_decimals: 0,
    offset: 0,
    factor: 0,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch parameter type data
  useEffect(() => {
    const fetchParameterType = async () => {
      setLoading(true);
      try {
        const response = await links.getParametersByStation(Number(parameterTypeId));
        if (response.success && response.data) {
          setFormData({
            name: response.data[0]?.name_station || "",
            measure_unit: "",
            qnt_decimals: 0,
            offset: 0,
            factor: 0,
            is_active: true,
          });
        } else {
          setErrorMessage("Erro ao carregar os dados do tipo de parâmetro.");
        }
      } catch (error) {
        console.error("Erro ao carregar os dados do tipo de parâmetro:", error);
        setErrorMessage("Erro ao carregar os dados do tipo de parâmetro.");
      } finally {
        setLoading(false);
      }
    };

    fetchParameterType();
  }, [parameterTypeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "qnt_decimals" ? parseInt(value) : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await links.updateParameterType(Number(parameterTypeId), formData);
      if (response.success) {
        setSuccessMessage("Tipo de parâmetro atualizado com sucesso!");
        setTimeout(() => navigate("/listartipoparametro"), 2000); // Redireciona após 2 segundos
      } else {
        setErrorMessage(response.error || "Erro ao atualizar o tipo de parâmetro.");
      }
    } catch (error) {
      console.error("Erro ao atualizar o tipo de parâmetro:", error);
      setErrorMessage("Erro ao atualizar o tipo de parâmetro.");
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
        {errorMessage && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {successMessage}
          </Alert>
        )}
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
          name="measure_unit"
          value={formData.measure_unit}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: "16px" }}
        />
        <TextField
          label="Quantidade de Decimais"
          name="qnt_decimals"
          type="number"
          value={formData.qnt_decimals}
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