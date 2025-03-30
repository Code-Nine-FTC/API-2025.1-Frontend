import React, { useState } from "react";
import { links } from "../services/api";
import { Box, Button, CircularProgress, TextField, Alert, Card, CardContent, CardHeader } from "@mui/material";
import { LoggedLayout } from "@components/layout/layoutLogged";

const RegisterParameterType: React.FC = () => {
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

  return (
    <LoggedLayout>
      <Box sx={{ maxWidth: 900, margin: "0 auto", padding: 4 }}>
        <Card sx={{ padding: 2 }}>
          <CardHeader title="Cadastrar Tipo de Parâmetro" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Unidade de Medida"
                name="measureUnit"
                value={formData.measureUnit}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Quantidade de Decimais"
                name="qntDecimals"
                type="number"
                value={formData.qntDecimals}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Offset (opcional)"
                name="offset"
                type="number"
                value={formData.offset || ""}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Fator (opcional)"
                name="factor"
                type="number"
                value={formData.factor || ""}
                onChange={handleChange}
                margin="normal"
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
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
          </CardContent>
        </Card>
      </Box>
    </LoggedLayout>
  );
};

export default RegisterParameterType;