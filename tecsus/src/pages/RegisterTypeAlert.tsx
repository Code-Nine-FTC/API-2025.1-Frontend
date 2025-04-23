import React, { useEffect, useRef, useState } from "react";
import { AlertTypeForm } from "../components/ui/AlertTypeForm";
import typeAlertGetters from "../store/typealerts/getters";
import stationGetters from "../store/station/getters";
import { LoggedLayout } from "../layout/layoutLogged";
import { useNavigate, useParams } from "react-router-dom";

const RegisterAlertType = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [initialValues, setInitialValues] = useState<{
    parameter_id: number;
    name: string;
    value: number;
    math_signal: string;
    status: string;
    station_id?: number;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(!!id);
  const [stations, setStations] = useState<
    Array<{
      id: number;
      name_station: string;
      parameters: Array<{
        parameter_id: number;
        name_parameter: string;
      }>;
    }>
  >([]);
  const [parameters, setParameters] = useState<
    Array<{ id: number; name_parameter: string }>
  >([]);

  const hasFetchedAlert = useRef(false);

  useEffect(() => {
    const fetchStations = async () => {
      const res = await stationGetters.listStations();
      if (res.success && res.data) {
        setStations(res.data);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    if (id && stations.length > 0 && !hasFetchedAlert.current) {
      const fetchAlertType = async () => {
        try {
          const response = await typeAlertGetters.getAlertType(Number(id));
          if (response.success && response.data) {
            const alertData = response.data;

            const foundStation = stations.find((station) =>
              station.parameters?.some(
                (p) => p.parameter_id === alertData.parameter_id
              )
            );

            const stationId = foundStation?.id;
            const paramList = foundStation
              ? foundStation.parameters.map((p) => ({
                  id: p.parameter_id,
                  name_parameter: p.name_parameter,
                }))
              : [];

            setParameters(paramList);
            
            setInitialValues({
              parameter_id: alertData.parameter_id,
              name: alertData.name,
              value: alertData.value,
              math_signal: alertData.math_signal,
              status: alertData.status,
              station_id: stationId,
            });
            hasFetchedAlert.current = true;
          } else {
            alert("Erro ao carregar dados do tipo de alerta.");
            navigate("/list-alert-type");
          }
        } catch (error) {
          console.error(error);
          alert("Erro ao carregar dados do tipo de alerta.");
          navigate("/list-alert-type");
        } finally {
          setLoading(false);
        }
      };

      fetchAlertType();
    } else if (!id) {
      setLoading(false);
    }
  }, [id, stations, navigate]);

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

      if (
        formattedForm.value < -2147483648 ||
        formattedForm.value > 2147483647
      ) {
        alert("O valor deve estar entre -2.147.483.648 e 2.147.483.647.");
        return;
      }

      if (id) {
        const res = await typeAlertGetters.updateAlertType(Number(id), formattedForm);
        if (!res.success) {
          alert(res.error || "Erro ao atualizar tipo de alerta.");
          return;
        }
        alert("Tipo de alerta atualizado com sucesso!");
      } else {
        const res = await typeAlertGetters.createAlertType(formattedForm);
        if (!res.success) {
          alert(res.error || "Erro ao criar tipo de alerta.");
          return;
        }
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
        stations={stations}
        parameters={parameters}
        setParameters={setParameters}
      />
    </LoggedLayout>
  );
};

export default RegisterAlertType;