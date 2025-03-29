import React from "react";
import { AlertTypeForm } from "@components/AlertTypeForm";
import { links } from "../services/api";
import { LoggedLayout } from "@components/layout/layoutLogged";

const RegisterAlertType = () => {
  const handleSubmit = async (form: {
    parameter_id: number;
    name: string;
    value: number;
    math_signal: string;
    status: string;
  }) => {
    try {
      const formattedForm = {
        ...form,
        value: Number(form.value),
      };

      if (formattedForm.value < -2147483648 || formattedForm.value > 2147483647) {
        alert("O valor deve estar entre -2.147.483.648 e 2.147.483.647.");
        return;
      }

      const response = await links.createAlertType(formattedForm);
      console.log("Tipo de alerta cadastrado com sucesso:", response);
      alert("Tipo de alerta cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar tipo de alerta:", error);
      alert("Erro ao cadastrar tipo de alerta.");
    }
  };

  return (
    <LoggedLayout>
      <AlertTypeForm
        onSubmit={handleSubmit}
        title="Cadastro de Tipo de Alerta"
        submitLabel="Cadastrar"
      />
    </LoggedLayout>
  );
};

export default RegisterAlertType;