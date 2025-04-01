import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import { Cancel as CancelIcon } from "@mui/icons-material";
import "../pages/styles/registerstation.css";
import { links } from "../services/api";
import { useAuth } from "../services/authContext";

export interface FormFields {
  name: string;
  uid: string;
  country: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
  parameter_types: { type: string; unit: string }[];
}

interface StationFormProps {
  initialValues?: Partial<FormFields>;
  onSubmit?: (form: FormFields) => void;
  title?: string;
  submitLabel?: string;
  readOnly?: boolean;
  withCardLayout?: boolean;
  stationId?: number;
}

export const StationForm: React.FC<StationFormProps> = ({
  initialValues = {},
  onSubmit,
  title = "Cadastro de Estação",
  submitLabel = "Salvar",
  readOnly = false,
  withCardLayout = true,
  stationId,
}) => {
  const [form, setForm] = useState<FormFields>({
    name: "",
    uid: "",
    country: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    parameter_types: [],
    ...initialValues,
  });

  const [availableParameters, setAvailableParameters] = useState<Array<{ id: number; name: string }>>([]);

  const auth = useAuth();

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await links.listParameterTypes();
        setAvailableParameters(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar parâmetros:", error);
      }
    };
    fetchParameters();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (readOnly) return;
    const { name, value } = e.target;
    setForm({ ...form, [name]: value } as FormFields);
  };

  const handleSelectChange = (event: any) => {
    if (readOnly) return;

    const selectedIds = event.target.value as string[];

    const updated = selectedIds.map((id) => ({ type: id, unit: "" }));

    if (JSON.stringify(updated) !== JSON.stringify(form.parameter_types)) {
      setForm((prevForm) => ({
        ...prevForm,
        parameter_types: updated,
      }));
    }
  };

  const handleRemoveParameter = async (paramId: string) => {
    if (readOnly) return;

    try {
      if (stationId) {
        const result = await links.removeParameterFromStation(stationId, parseInt(paramId));
        if (!result.success) {
          throw new Error(result.error || "Erro ao remover");
        }
      }

      const updated = form.parameter_types.filter((p) => p.type !== paramId);

      setForm((prevForm) => ({
        ...prevForm,
        parameter_types: updated,
      }));
    } catch (err) {
      console.error("Erro ao remover parâmetro:", err);
      alert("Erro ao remover parâmetro");
    }
  };

  const renderInput = (label: string, name: keyof FormFields, className = "") => (
    <div className={`input-group-wrapper ${className}`}>
      <div className="input-group">
        <label className="input-label"><strong>{label}</strong></label>
        <input
          type="text"
          name={name}
          value={typeof form[name] === "string" ? form[name] : ""}
          onChange={handleChange}
          className="input-field"
          disabled={readOnly}
        />
      </div>
    </div>
  );

  const renderParameterChips = () => {
    return (
      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
        {form.parameter_types.map((p) => {
          const paramName = availableParameters.find((ap) => ap.id === parseInt(p.type))?.name || p.type;
          return (
            <Chip
              key={p.type}
              label={paramName}
              onDelete={
                readOnly
                  ? undefined
                  : async () => {
                      await handleRemoveParameter(p.type);
                    }
              }
              deleteIcon={!readOnly ? <CancelIcon /> : undefined}
            />
          );
        })}
      </Box>
    );
  };

  const renderParameterSelect = () => {
    return (
      <FormControl fullWidth className="input-group-wrapper" disabled={readOnly}>
        <InputLabel>Adicionar Parâmetros</InputLabel>
        <Select
          multiple
          value={form.parameter_types.map((p) => p.type)}
          onChange={handleSelectChange}
          renderValue={(selected) =>
            (selected as string[])
              .map((id) => availableParameters.find((opt) => opt.id.toString() === id)?.name)
              .join(", ")
          }
        >
          {availableParameters.map((option) => (
            <MenuItem key={option.id} value={option.id.toString()}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    if (onSubmit) {
      onSubmit(form);
    }
  };

  const content = (
    <>
      {title && (
        <Typography variant="h4" align="center" className="estacao-title">
          {title}
        </Typography>
      )}
      <form className="estacao-form" onSubmit={handleFormSubmit}>
        {renderInput("Nome da estação", "name")}
        {renderInput("UID", "uid")}
        <div className="row">
          {renderInput("País", "country", "input-bairro")}
          {renderInput("Cidade", "city", "input-cidade")}
          {renderInput("Estado", "state", "input-tiny")}
        </div>
        <div className="row">
          {renderInput("Latitude", "latitude", "input-coord")}
          {renderInput("Longitude", "longitude", "input-coord")}
        </div>

        {auth.isAuthenticated && (
          <>
            {renderParameterChips()}
            {!readOnly && renderParameterSelect()}
          </>
        )}

        {!readOnly && (
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
        )}
      </form>
    </>
  );

  return withCardLayout === false ? content : (
    <Box className="estacao-wrapper">
      <Paper className="estacao-card">{content}</Paper>
    </Box>
  );
};
