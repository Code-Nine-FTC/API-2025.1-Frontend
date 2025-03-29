import React from "react";
import { AlertForm } from "@components/AlertForm";
import { links } from "../services/api";
import { LoggedLayout } from "@components/layout/layoutLogged";

const RegisterAlert = () => {
  const handleSubmit = async (form: { type_alert_id: string; measure_id: string }) => {
    try {
      const response = await links.createAlert({
        type_alert_id: form.type_alert_id,
        measure_id: form.measure_id,
      });
      console.log("Alerta cadastrado com sucesso:", response);
      alert("Alerta cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar alerta:", error);
      alert("Erro ao cadastrar alerta.");
    }
  };

  return (
    <LoggedLayout>
    <AlertForm
      onSubmit={handleSubmit}
      title="Cadastro de Alerta"
      submitLabel="Cadastrar"
    />
    </LoggedLayout>
  );
};

export default RegisterAlert;