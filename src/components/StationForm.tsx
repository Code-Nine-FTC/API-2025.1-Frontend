import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText, SelectChangeEvent } from "@mui/material";
import "../pages/styles/registerstation.css";
import { links } from "../services/api"; 

interface FormFields {
  name: string;
  uid: string;
  latitude: string;
  longitude: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
  parameter_types: string[];
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
    address: {
      city: "",
      state: "",
      country: "", 
    },
    parameter_types: [], 
    ...initialValues,
  });

  const [parameterTypes, setParameterTypes] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchParameterTypes = async () => {
      try {
        const response = await links.listParameterTypes();
        if (response.success && response.data) {
          setParameterTypes(response.data.map((type: { id: number; name: string; measure_unit: string }) => ({
            id: type.id.toString(),
            name: type.name,
          })));
        } else {
          console.error("Erro ao buscar tipos de parâmetros:", response.error);
        }
      } catch (error) {
        console.error("Erro ao buscar tipos de parâmetros:", error);
      }
    };

    fetchParameterTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;

    if (name?.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setForm({
        ...form,
        address: {
          ...form.address,
          [addressField]: value as string,
        },
      });
    } else {
      setForm({ ...form, [name as keyof FormFields]: value as string });
    }
  };

  const handleParameterChange = (event: SelectChangeEvent<string[]>) => {
    setForm({
      ...form,
      parameter_types: event.target.value as string[],
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const renderInput = (label: string, name: keyof FormFields | string, className = "") => (
    <div className={`input-group-wrapper ${className}`}>
      <div className="input-group">
        <label className="input-label"><strong>{label}</strong></label>
        <input
          type="text"
          name={name}
          value={name.startsWith("address.") ? form.address[name.split(".")[1] as keyof FormFields["address"]] || "" : (form[name as keyof FormFields] as string) || ""}
          onChange={handleChange}
          className="input-field"
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
          {renderInput("Nome da estação", "name")}
          {renderInput("UID", "uid")}
          <div className="row">
            {renderInput("Cidade", "address.city", "input-medium")}
            {renderInput("Estado", "address.state", "input-tiny")}
            {renderInput("País", "address.country", "input-medium")}
          </div>
          <div className="row">
            {renderInput("Latitude", "latitude", "input-coord")}
            {renderInput("Longitude", "longitude", "input-coord")}
          </div>
          <Typography variant="h6" className="section-title">Tipos de Parâmetros</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="parameter-types-label">Selecione os Tipos de Parâmetros</InputLabel>
            <Select
              labelId="parameter-types-label"
              multiple
              value={form.parameter_types}
              onChange={handleParameterChange}
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {parameterTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  <Checkbox checked={form.parameter_types.includes(type.id)} />
                  <ListItemText primary={type.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
