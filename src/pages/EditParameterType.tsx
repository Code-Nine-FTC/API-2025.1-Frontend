import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { links } from "../services/api";
import { LoggedLayout } from "../components/layout/layoutLogged";
import "../pages/styles/registerstation.css";

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

  useEffect(() => {
    const fetchParameterType = async () => {
      setLoading(true);
      try {
        const response = await links.getParameterType(Number(parameterTypeId));
        if (response.success && response.data) {
          setFormData({
            name: response.data.data.name || "",
            measure_unit: response.data.data.measure_unit || "",
            qnt_decimals: response.data.data.qnt_decimals || 0,
            offset: response.data.data.offset || 0,
            factor: response.data.data.factor || 0,
            is_active: response.data.data.is_active ?? true,
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "qnt_decimals" ? parseInt(value) : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await links.updateParameterType(
        Number(parameterTypeId),
        formData
      );
      if (response.success) {
        setSuccessMessage("Tipo de parâmetro atualizado com sucesso!");
        setTimeout(() => navigate("/listartipoparametro"), 2000);
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LoggedLayout>
      <Box className="estacao-wrapper">
        <Paper className="estacao-card">
          <Typography variant="h4" align="center" className="estacao-title">
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

          <Box className="estacao-form">
            <Box className="row">
              <Box className="input-group-wrapper">
                <Box className="input-group">
                  <label className="input-label">Nome</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </Box>
              </Box>
            </Box>

            <Box className="row">
              <Box className="input-group-wrapper">
                <Box className="input-group">
                  <label className="input-label">Unidade de Medida</label>
                  <input
                    type="text"
                    name="measure_unit"
                    value={formData.measure_unit}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </Box>
              </Box>
            </Box>

            <Box className="row">
              <Box className="input-group-wrapper">
                <Box className="input-group">
                  <label className="input-label">Quantidade de Decimais</label>
                  <input
                    type="number"
                    name="qnt_decimals"
                    value={formData.qnt_decimals}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </Box>
              </Box>
            </Box>

            <Box className="row">
              <Box className="input-group-wrapper">
                <Box className="input-group">
                  <label className="input-label">Offset</label>
                  <input
                    type="number"
                    name="offset"
                    value={formData.offset}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </Box>
              </Box>
            </Box>

            <Box className="row">
              <Box className="input-group-wrapper">
                <Box className="input-group">
                  <label className="input-label">Fator</label>
                  <input
                    type="number"
                    name="factor"
                    value={formData.factor}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </Box>
              </Box>
            </Box>

            <Box mt={3} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                className="estacao-btn"
              >
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </LoggedLayout>
  );
};

export default EditParameterType;