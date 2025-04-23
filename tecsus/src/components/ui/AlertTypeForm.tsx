import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import "../../pages/styles/registerstation.css";

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
  onSubmit: (form: Omit<FormFields, "station_id">) => void;
  title?: string;
  submitLabel?: string;
  stations: Array<{
    id: number;
    name_station: string;
    parameters: Array<{
      parameter_id: number;
      name_parameter: string;
    }>;
  }>;
  parameters: Array<{ id: number; name_parameter: string }>;
  setParameters: React.Dispatch<React.SetStateAction<Array<{ id: number; name_parameter: string }>>>;
  disabled?: boolean;
  actionButtons?: React.ReactNode;
}

export const AlertTypeForm: React.FC<AlertTypeFormProps> = ({
  initialValues = {},
  onSubmit,
  title = "Cadastro de Tipo de Alerta",
  submitLabel = "Salvar",
  stations,
  parameters,
  setParameters,
  disabled = false,
  actionButtons,
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

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (initialValues && !hasInitialized.current) {
      setForm((prevForm) => ({ ...prevForm, ...initialValues }));

      if (initialValues.station_id) {
        const station = stations.find(s => s.id === initialValues.station_id);
        if (station) {
          const params = station.parameters.map(p => ({
            id: p.parameter_id,
            name_parameter: p.name_parameter,
          }));
          setParameters(params);
        }
      }

      hasInitialized.current = true;
    }
  }, [initialValues, stations, setParameters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (disabled) return;

    const { name, value } = e.target;
    let maskedValue: string | number = value;

    if (["parameter_id", "station_id", "value"].includes(name)) {
      maskedValue = parseInt(value, 10) || 0;
    }

    const updatedForm = {
      ...form,
      [name]: maskedValue,
    };

    if (name === "station_id") {
      updatedForm.parameter_id = 0;

      const station = stations.find((s) => s.id === Number(value));
      if (station) {
        const params = station.parameters.map((p) => ({
          id: p.parameter_id,
          name_parameter: p.name_parameter,
        }));
        setParameters(params);
      } else {
        setParameters([]);
      }
    }

    setForm(updatedForm);
  };

  const renderInput = (label: string, name: keyof FormFields) => (
    <div className="input-group-wrapper">
      <div className="input-group">
        <label className="input-label"><strong>{label}</strong></label>
        <input
          type="text"
          name={name}
          value={form[name] ?? ""}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        />
      </div>
    </div>
  );

  const renderSelect = (
    label: string,
    name: keyof FormFields,
    options: Array<{ value: string | number; label: string }>,
    forceDisabled: boolean = false
  ) => (
    <div className="input-group-wrapper">
      <div className="input-group">
        <label className="input-label"><strong>{label}</strong></label>
        <select
          name={name}
          value={form[name] ?? ""}
          onChange={handleChange}
          className="input-field"
          required
          disabled={disabled || forceDisabled}
        >
          <option value="">Selecione</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { station_id, ...safeData } = form;

    if (!form.parameter_id || !form.name || !form.value || !form.math_signal || !form.status) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    onSubmit(safeData);
  };

  return (
    <Box className="estacao-wrapper">
      <Paper className="estacao-card">
        <Typography variant="h4" align="center" className="estacao-title">
          {title}
        </Typography>
        <form className="estacao-form" onSubmit={handleFormSubmit}>
          {renderSelect("Estação", "station_id", stations.map((station) => ({
            value: station.id,
            label: station.name_station,
          })))}

          {renderSelect(
            "Parâmetro",
            "parameter_id",
            parameters.map((p) => ({
              value: p.id,
              label: p.name_parameter,
            })),
            !form.station_id
          )}

          {renderInput("Nome", "name")}
          {renderInput("Valor", "value")}
          {renderSelect("Sinal Matemático", "math_signal", [
            { value: ">", label: "Maior que (>)" },
            { value: "<", label: "Menor que (<)" },
            { value: "=", label: "Igual a (=)" },
            { value: "<=", label: "Menor ou igual a (<=)" },
            { value: ">=", label: "Maior ou igual a (>=)" },
          ])}
          {renderSelect("Status", "status", [
            { value: "G", label: "Seguro" },
            { value: "Y", label: "Risco Moderado" },
            { value: "R", label: "Risco Alto" },
          ])}

          {actionButtons ? (
            <Box mt={3} textAlign="center">{actionButtons}</Box>
          ) : (
            !disabled && (
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
            )
          )}
        </form>
      </Paper>
    </Box>
  );
};