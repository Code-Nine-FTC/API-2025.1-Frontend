import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from "@mui/material";
import "../pages/styles/registerstation.css";
import { links } from "../services/api";

interface FormFields {
  type_alert_id: string;
  measure_id: string;
}

interface AlertFormProps {
  initialValues?: Partial<FormFields>;
  onSubmit: (form: FormFields) => void;
  title?: string;
  submitLabel?: string;
}

export const AlertForm: React.FC<AlertFormProps> = ({
  initialValues = {},
  onSubmit,
  title = "Cadastro de Alerta",
  submitLabel = "Salvar",
}) => {
  const [form, setForm] = useState<FormFields>({
    type_alert_id: "",
    measure_id: "",
    ...initialValues,
  });

  const [alertTypes, setAlertTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAlertTypes = async () => {
      try {
        const response = await links.getAllAlertTypes();
        if (response.success && response.data) {
          setAlertTypes(response.data.map((type) => ({ id: type.id, name: type.name })));
        }
      } catch (error) {
        console.error("Erro ao buscar tipos de alerta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value } as FormFields);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name!]: value } as FormFields);
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="type-alert-label">Tipo de Alerta</InputLabel>
            <Select
              labelId="type-alert-label"
              name="type_alert_id"
              value={form.type_alert_id}
              onChange={handleSelectChange}
              disabled={loading}
            >
              {alertTypes.map((type) => (
                <MenuItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {renderInput("ID da Medida", "measure_id")}
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