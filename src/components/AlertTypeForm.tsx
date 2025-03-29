import React, { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import "../pages/styles/registerstation.css";

interface FormFields {

  name: string;
  value: string;
  math_signal: string;
  status: string;
}

interface AlertTypeFormProps {
  initialValues?: Partial<FormFields>;
  onSubmit: (form: FormFields) => void;
  title?: string;
  submitLabel?: string;
}

export const AlertTypeForm: React.FC<AlertTypeFormProps> = ({
  initialValues = {},
  onSubmit,
  title = "Cadastro de Tipo de Alerta",
  submitLabel = "Salvar",
}) => {
  const [form, setForm] = useState<FormFields>({
    name: "",
    value: "",
    math_signal: "",
    status: "",
    ...initialValues,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "parameter_id" || name === "value") {
      maskedValue = value.replace(/[^\d]/g, "");
    }

    setForm({ ...form, [name]: maskedValue } as FormFields);
  };

  const renderInput = (label: string, name: keyof FormFields, className = "") => (
    <div className={`input-group-wrapper ${className}`}>
      <div className="input-group">
        <label className="input-label"><strong>{label}</strong></label>
        <input
          type="text"
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="input-field"
        />
      </div>
    </div>
  );

  const renderSelect = (label: string, name: keyof FormFields, options: Array<{ value: string; label: string }>) => (
    <div className="input-group-wrapper">
      <div className="input-group">
        <label className="input-label"><strong>{label}</strong></label>
        <select
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Selecione</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box className="estacao-wrapper">
      <Paper className="estacao-card">
        <Typography variant="h4" align="center" className="estacao-title">
          {title}
        </Typography>
        <form className="estacao-form" onSubmit={handleFormSubmit}>
          {renderInput("Nome", "name")}
          {renderInput("Valor", "value")}
          {renderSelect("Sinal Matemático", "math_signal", [
            { value: ">", label: "Maior que (>)" },
            { value: "<", label: "Menor que (<)" },
            { value: "=", label: "Igual a (=)" },
            { value: "=<", label: "Menor ou igual a (=<)" },
            { value: ">=", label: "Maior ou igual a (>=)" },
          ])}
          {renderSelect("Status", "status", [
            { value: "Ok", label: "Ok" },
            { value: "Warning", label: "Estado de atenção" },
            { value: "Danger", label: "Perigo" },
          ])}
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