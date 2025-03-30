import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { links } from "../services/api";
import { Box, Button, CircularProgress, Alert, Paper, Typography } from "@mui/material";
import { LoggedLayout } from "@components/layout/layoutLogged";
import "../pages/styles/registerstation.css";

const RegisterParameterType = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    measureUnit: "",
    qntDecimals: 0,
    offset: undefined,
    factor: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "qntDecimals" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await links.createParameterType({
        name: formData.name,
        measure_unit: formData.measureUnit,
        qnt_decimals: formData.qntDecimals,
        offset: formData.offset,
        factor: formData.factor,
      });
      if (response.success) {
        setSuccessMessage("Tipo de parâmetro cadastrado com sucesso!");
        setFormData({
          name: "",
          measureUnit: "",
          qntDecimals: 0,
          offset: undefined,
          factor: undefined,
        });
        navigate("/listartipoparametro");
      } else {
        setErrorMessage(response.error || "Erro ao cadastrar tipo de parâmetro.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar tipo de parâmetro:", error);
      setErrorMessage("Erro ao cadastrar tipo de parâmetro.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label: string, name: keyof typeof formData, type: string = "text") => (
    <div className="input-group-wrapper">
      <div className="input-group">
        <label className="input-label">
          <strong>{label}</strong>
        </label>
        <input
          type={type}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          className="input-field"
        />
      </div>
    </div>
  );

  return (
    <LoggedLayout>
      <Box className="estacao-wrapper">
        <Paper className="estacao-card">
          <Typography variant="h4" align="center" className="estacao-title">
            Cadastro de Tipo de Parâmetro
          </Typography>
          <form className="estacao-form" onSubmit={handleSubmit}>
            {renderInput("Nome", "name")}
            {renderInput("Unidade de Medida", "measureUnit")}
            {renderInput("Quantidade de Decimais", "qntDecimals", "number")}
            {renderInput("Offset (opcional)", "offset", "number")}
            {renderInput("Fator (opcional)", "factor", "number")}
            <Box mt={3} textAlign="center">
              <Button
                variant="contained"
                type="submit"
                className="estacao-btn"
                style={{ backgroundColor: "#5f5cd9", color: "white" }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Cadastrar"}
              </Button>
            </Box>
          </form>
          {successMessage && (
            <Alert severity="success" sx={{ marginTop: 2 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ marginTop: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </Paper>
      </Box>
    </LoggedLayout>
  );
};

export default RegisterParameterType;