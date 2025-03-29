import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import "../pages/styles/registerstation.css";
import { links } from "../services/api";

interface FormFields {
  parameter_id: number;
  name: string;
  value: number;
  math_signal: string;
  status: string;
  station_id?: number;
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
    parameter_id: 0,
    name: "",
    value: 0,
    math_signal: "",
    status: "",
    station_id: undefined,
    ...initialValues,
  });

  const [stations, setStations] = useState<Array<{ value: string; label: string }>>([]);

  // Buscar estações do backend
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await links.getFilteredStations();
        if (response.success && response.data) {
          const stationOptions = response.data.map((station: { id: number; name_station: string }) => ({
            value: station.id.toString(), // ID da estação como valor
            label: station.name_station, // Nome da estação como label
          }));
          setStations(stationOptions);
        } else {
          console.error("Erro ao buscar estações:", response.error);
        }
      } catch (error) {
        console.error("Erro ao buscar estações:", error);
      }
    };

    fetchStations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let maskedValue: string | number = value;

    if (name === "parameter_id" || name === "value" || name === "station_id") {
      maskedValue = parseInt(value, 10) || 0; // Converte para número
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
              {option.label} {/* Renderiza apenas o nome da estação */}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.parameter_id || !form.station_id || !form.name || !form.value || !form.math_signal || !form.status) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    onSubmit(form);
  };

  return (
    <Box className="estacao-wrapper">
      <Paper className="estacao-card">
        <Typography variant="h4" align="center" className="estacao-title">
          {title}
        </Typography>
        <form className="estacao-form" onSubmit={handleFormSubmit}>
          {renderSelect("ID do Parâmetro", "parameter_id", [
            { value: "1", label: "Parâmetro 1" },
            { value: "2", label: "Parâmetro 2" },
            { value: "3", label: "Parâmetro 3" },
          ])}

          {renderSelect("Estações", "station_id", stations)} {/* Exibe apenas os nomes das estações */}
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