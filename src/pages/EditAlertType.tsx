import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { links } from "../services/api";
import { AlertTypeForm } from "@components/AlertTypeForm";
import { LoggedLayout } from "@components/layout/layoutLogged";

export interface AlertTypeResponse {
  id: number;
  parameter_id: number | null;
  name: string;
  value: number;
  math_signal: string;
  status: string | null;
  is_active: boolean;
  create_date: number;
  last_update: Date;
}

export interface AlertTypeUpdate {
  parameter_id?: number;
  name?: string;
  value?: number;
  math_signal?: string;
  status?: string;
  station_id?: number | null;
}

interface FormFields {
  parameter_id: number;
  name: string;
  value: number;
  math_signal: string;
  status: string;
  station_id?: number;
}

export const EditAlertType = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<FormFields>>({
    parameter_id: 0,
    name: "",
    value: 0,
    math_signal: "",
    status: "",
    station_id: undefined,
  });

  useEffect(() => {
    const fetchAlertType = async () => {
      try {
        if (!id) return;

        const response = await links.getAlertType(parseInt(id));
		console.log("Resposta da API para o tipo de alerta:", response);

		const alertTypeData = response.data.data;

        if (alertTypeData) {
          setInitialValues({
            parameter_id: alertTypeData.parameter_id || 0,
            name: alertTypeData.name || "",
            value: alertTypeData.value || 0,
            math_signal: alertTypeData.math_signal || "",
            status: alertTypeData.status || "",
          });
          
        } else {
          setError("Tipo de alerta não encontrado");
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados do tipo de alerta");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlertType();
  }, [id]);

  const handleUpdate = async (form: FormFields) => {
    try {
      if (!id) return;

      const payload = {
        parameter_id: form.parameter_id,
        name: form.name,
        value: form.value,
        math_signal: form.math_signal,
        status: form.status,
      };

      const response = await links.updateAlertType(parseInt(id), payload);

      if (response.success) {
        alert("Tipo de alerta atualizado com sucesso!");
        navigate("/listartipoalerta");
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error("Erro na atualização:", err);
      alert("Erro ao atualizar tipo de alerta");
    }
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <LoggedLayout>
    <AlertTypeForm
      initialValues={initialValues}
      onSubmit={handleUpdate}
      title="Editar Tipo de Alerta"
      submitLabel="Atualizar"
    />
    </LoggedLayout>
  );
};