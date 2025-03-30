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
  SelectChangeEvent,
} from "@mui/material";
import "../pages/styles/registerstation.css";
import { links } from "../services/api";

interface FormFields {
  name: string;
  uid: string;
  zip: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
  parameter_types: Array<{ type: string; unit: string }>;
}

interface StationFormProps {
  initialValues?: Partial<FormFields>;
  onSubmit?: (form: FormFields) => void;
  title?: string;
  submitLabel?: string;
  readOnly?: boolean;
  withCardLayout?: boolean;
}

export const StationForm: React.FC<StationFormProps> = ({
  initialValues = {},
  onSubmit,
  title = "Cadastro de Estação",
  submitLabel = "Salvar",
  readOnly = false,
  withCardLayout = true,
}) => {
  const [form, setForm] = useState<FormFields>({
    name: "",
    uid: "",
    zip: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    parameter_types: [],
    ...initialValues,
  });

  const [availableParameters, setAvailableParameters] = useState<Array<{ id: number; name: string }>>([]);

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

  useEffect(() => {
    if (initialValues.zip) {
      fetchAddressByZip(initialValues.zip);
    }
  }, [initialValues]);

  const fetchAddressByZip = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar endereço pelo CEP:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (readOnly) return;

    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "zip") {
      maskedValue = value.replace(/\D/g, "").slice(0, 8);
      if (maskedValue.length > 5) {
        maskedValue = maskedValue.replace(/(\d{5})(\d{1,3})/, "$1-$2");
      }
    }

    if (name === "latitude" || name === "longitude") {
      maskedValue = value.replace(/[^\d.-]/g, "").slice(0, 10);
    }

    setForm({ ...form, [name]: maskedValue } as FormFields);

    if (name === "zip" && maskedValue.length === 9) {
      const rawCep = maskedValue.replace(/\D/g, "");
      fetchAddressByZip(rawCep);
    }
  };

  const handleParameterChange = (event: SelectChangeEvent<number[]>) => {
    if (readOnly) return;

    const selectedIds = event.target.value as number[];
    setForm({
      ...form,
      parameter_types: selectedIds.map((id) => ({ type: id.toString(), unit: "" })),
    });
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

  const renderSelect = (
    label: string,
    name: keyof FormFields,
    options: Array<{ id: number; name: string }>
  ) => (
    <FormControl className="input-group-wrapper" disabled={readOnly}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={form.parameter_types.map((param) => parseInt(param.type))}
        onChange={handleParameterChange}
        renderValue={(selected) =>
          selected.map((id) => options.find((opt) => opt.id === id)?.name).join(", ")
        }
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    const parameterTypeIds = form.parameter_types.map((param) => parseInt(param.type));

    const stationData = {
      name: form.name,
      uid: form.uid,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      address: {
        city: form.city,
        state: form.state,
        country: "Brasil",
      },
      parameter_types: parameterTypeIds,
    };

    try {
      const result = await links.createStation(stationData);
      if (result.success) {
        alert("Estação criada com sucesso!");
        onSubmit?.(form);
        setForm({
          name: "",
          uid: "",
          zip: "",
          street: "",
          number: "",
          neighborhood: "",
          city: "",
          state: "",
          latitude: "",
          longitude: "",
          parameter_types: [],
        });
      } else {
        alert(`Erro ao criar estação: ${result.error}`);
      }
    } catch (error) {
      console.error("Erro ao criar estação:", error);
      alert("Erro ao criar estação.");
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
          {renderInput("Código Postal", "zip", "input-small")}
          {renderInput("Rua", "street", "input-medium")}
          {renderInput("Número", "number", "input-tiny")}
        </div>
        <div className="row">
          {renderInput("Bairro", "neighborhood", "input-bairro")}
          {renderInput("Cidade", "city", "input-cidade")}
          {renderInput("Estado", "state", "input-tiny")}
        </div>
        <div className="row">
          {renderInput("Latitude", "latitude", "input-coord")}
          {renderInput("Longitude", "longitude", "input-coord")}
        </div>
        <div className="row">
          {renderSelect("Parâmetros disponíveis", "parameter_types", availableParameters)}
        </div>
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
