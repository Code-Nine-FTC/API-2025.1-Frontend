import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import "../pages/styles/registerstation.css";

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
}

interface StationFormProps {
  initialValues?: Partial<FormFields>;
  onSubmit: (form: FormFields) => void;
  title?: string;
  submitLabel?: string;
  readOnly?: boolean;
}

export const StationForm: React.FC<StationFormProps> = ({
  initialValues = {},
  onSubmit,
  title = "Cadastro de Estação",
  submitLabel = "Salvar",
  readOnly = false,
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
    ...initialValues,
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          readOnly={readOnly}
        />
      </div>
    </div>
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readOnly) {
      onSubmit(form);
    }
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
      </Paper>
    </Box>
  );
};
