import React, { useState, useEffect, useCallback } from "react";
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
    ...initialValues,
  });

  const [parameters, setParameters] = useState<Array<{ value: string; label: string }>>([]);
  const [stations, setStations] = useState<Array<{ value: string; label: string }>>([]);
  const [loadingStations, setLoadingStations] = useState(false);

  // Atualiza o formulário com os valores iniciais apenas uma vez
  useEffect(() => {
    // Verifica se os valores iniciais são diferentes do estado atual antes de atualizar
    setForm((prevForm) => {
      if (JSON.stringify(prevForm) !== JSON.stringify({ ...prevForm, ...initialValues })) {
        return { ...prevForm, ...initialValues };
      }
      return prevForm;
    });
  }, [initialValues]);

  // Busca os parâmetros ao carregar o componente
  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await links.listParameterTypes();
        if (response.success && response.data) {
          const parameterOptions = response.data.map((parameter: { id: number; name: string }) => ({
            value: parameter.id.toString(),
            label: parameter.name,
          }));
          setParameters(parameterOptions);
        } else {
          console.error("Erro ao buscar parâmetros:", response.error);
        }
      } catch (error) {
        console.error("Erro ao buscar parâmetros:", error);
      }
    };

    fetchParameters();
  }, []);

  // Busca as estações associadas ao parâmetro selecionado
  const fetchStationsByParameter = useCallback(
    async (parameterId: number) => {
      if (!parameterId) return; // Evita chamadas desnecessárias
      setLoadingStations(true);
      try {
        const response = await links.getParametersByStation(parameterId);
        if (response.success && response.data) {
          const stationOptions = response.data.map((station: { id: number; name_station: string }) => ({
            value: station.id.toString(),
            label: station.name_station,
          }));
          setStations(stationOptions);
        } else {
          console.error("Erro ao buscar estações:", response.error);
        }
      } catch (error) {
        console.error("Erro ao buscar estações:", error);
      } finally {
        setLoadingStations(false);
      }
    },
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let maskedValue: string | number = value;

    if (name === "parameter_id" || name === "value" || name === "station_id") {
      maskedValue = parseInt(value, 10) || 0; // Converte para número
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]: maskedValue,
    }));

    // Se o parâmetro for alterado, busca as estações associadas
    if (name === "parameter_id" && maskedValue) {
      fetchStationsByParameter(maskedValue as number);
    }
  };

  const renderInput = (label: string, name: keyof FormFields, className = "") => (
    <div className={`input-group-wrapper ${className}`}>
      <div className="input-group">
        <label className="input-label">
          <strong>{label}</strong>
        </label>
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

  const renderSelect = (
    label: string,
    name: keyof FormFields,
    options: Array<{ value: string; label: string }>,
    onFocus?: () => void
  ) => (
    <div className="input-group-wrapper">
      <div className="input-group">
        <label className="input-label">
          <strong>{label}</strong>
        </label>
        <select
          name={name}
          value={form[name]}
          onChange={handleChange}
          onFocus={onFocus} // Dispara a função ao focar no campo
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
          {renderSelect("ID do Parâmetro", "parameter_id", parameters)}
          {renderSelect(
            "Estações",
            "station_id",
            stations,
            () => {
              if (form.parameter_id && !loadingStations) {
                fetchStationsByParameter(form.parameter_id); // Carrega as estações ao focar no campo
              }
            }
          )}
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