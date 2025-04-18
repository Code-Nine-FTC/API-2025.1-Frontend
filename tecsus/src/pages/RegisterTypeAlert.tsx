import React, { useEffect, useState } from "react";
import { AlertTypeForm } from "../components/ui/AlertTypeForm";
import typeAlertGetters from "../store/typealerts/getters";
import { LoggedLayout } from "../layout/layoutLogged";
import { useNavigate, useParams } from "react-router-dom";

const RegisterAlertType = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Obtém o ID da URL
  const [initialValues, setInitialValues] = useState<{
    parameter_id: number;
    name: string;
    value: number;
    math_signal: string;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id); // Carrega os dados apenas se estiver no modo de edição

  useEffect(() => {
    if (id) {
      const fetchAlertType = async () => {
        try {
          const response = await typeAlertGetters.getAlertType(Number(id));
          console.log("Dados carregados:", response.data); // Verifica os dados carregados
          if (response.success && response.data) {
            setInitialValues(response.data);
          } else {
            alert("Erro ao carregar os dados do tipo de alerta.");
            navigate("/list-alert-type");
          }
        } catch (error) {
          console.error("Erro ao carregar tipo de alerta:", error);
          alert("Erro ao carregar os dados do tipo de alerta.");
          navigate("/list-alert-type");
        } finally {
          setLoading(false);
        }
      };

      fetchAlertType();
    }
  }, [id, navigate]);

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

      let response;
      if (id) {
        response = await typeAlertGetters.updateAlertType(Number(id), formattedForm);
        console.log("Tipo de alerta atualizado com sucesso:", response);
        alert("Tipo de alerta atualizado com sucesso!");
      } else {
        response = await typeAlertGetters.createAlertType(formattedForm);
        console.log("Tipo de alerta cadastrado com sucesso:", response);
        alert("Tipo de alerta cadastrado com sucesso!");
      }

      navigate("/list-alert-type");
    } catch (error) {
      console.error("Erro ao salvar tipo de alerta:", error);
      alert("Erro ao salvar tipo de alerta.");
    }
  };

  if (loading) {
    return (
      <LoggedLayout>
        <div>Carregando...</div>
      </LoggedLayout>
    );
  }

  return (
    <LoggedLayout>
      <AlertTypeForm
        onSubmit={handleSubmit}
        title={id ? "Editar Tipo de Alerta" : "Cadastro de Tipo de Alerta"}
        submitLabel={id ? "Salvar" : "Cadastrar"}
        initialValues={initialValues || undefined}
      />
    </LoggedLayout>
  );
};

export default RegisterAlertType;