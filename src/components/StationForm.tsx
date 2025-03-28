import React, { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import "../pages/styles/registerstation.css";

interface FormFields {
  name: string;
  uid: string;
  latitude: string;
  longitude: string;
}

interface StationFormProps {
  initialValues?: Partial<FormFields>;
  onSubmit: (form: FormFields) => void;
  title?: string;
  submitLabel?: string;
}

export const StationForm: React.FC<StationFormProps> = ({
  initialValues = {},
  onSubmit,
  title = "Cadastro de Estação",
  submitLabel = "Salvar",
}) => {
  const [form, setForm] = useState<FormFields>({
    name: "",
    uid: "",
    latitude: "",
    longitude: "",
    ...initialValues,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "latitude" || name === "longitude") {
      maskedValue = value.replace(/[^\d.-]/g, "").slice(0, 10);
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
          {renderInput("Nome da estação", "name")}
          {renderInput("UID", "uid")}
          <div className="row">
            {renderInput("Latitude", "latitude", "input-coord")}
            {renderInput("Longitude", "longitude", "input-coord")}
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