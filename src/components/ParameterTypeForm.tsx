import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import "../pages/styles/registerstation.css";

interface FormFields {
  name: string;
  measure_unit: string;
  qnt_decimals: string;
  offset?: string;
  factor?: string;
}

interface ParameterTypeFormProps {
  initialValues?: Partial<FormFields>;
  onSubmit: (form: FormFields) => void;
  title?: string;
  submitLabel?: string;
}

export const ParameterTypeForm: React.FC<ParameterTypeFormProps> = ({
  initialValues = {},
  onSubmit,
  title = "Cadastro de Tipo de Parâmetro",
  submitLabel = "Salvar",
}) => {
  const [form, setForm] = React.useState<FormFields>({
    name: "",
    measure_unit: "",
    qnt_decimals: "",
    offset: "",
    factor: "",
    ...initialValues,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const renderInput = (label: string, name: keyof FormFields, type = "text", className = "") => (
    <div className={`input-group-wrapper ${className}`}>
      <div className="input-group">
        <label className="input-label"><strong>{label}</strong></label>
        <input
          type={type}
          name={name}
          value={form[name] || ""}
          onChange={handleChange}
          className="input-field"
          step={type === "number" ? "any" : undefined}
        />
      </div>
    </div>
  );

  return (
    <Box className="estacao-wrapper">
      <Paper className="estacao-card">
        <Typography variant="h4" align="center" className="estacao-title">
          {title}
        </Typography>
        <form className="estacao-form" onSubmit={handleFormSubmit}>
          {renderInput("Nome do Parâmetro", "name")}
          {renderInput("Unidade de Medida", "measure_unit")}
          
          <div className="row">
            {renderInput("Casas Decimais", "qnt_decimals", "number", "input-small")}
            {renderInput("Offset", "offset", "number", "input-medium")}
            {renderInput("Fator", "factor", "number", "input-medium")}
          </div>

          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              type="submit"
              className="estacao-btn"
              style={{ backgroundColor: "#5f5cd9", color: "white" }}
            >
              {submitLabel}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};