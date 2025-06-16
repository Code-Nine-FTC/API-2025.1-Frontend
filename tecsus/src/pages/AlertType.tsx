import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  BlockOutlined,
  ArrowBack,
} from "@mui/icons-material";
import { LoggedLayout } from "../layout/layoutLogged";
import typeAlertGetters from "../store/typealerts/getters";
import stationGetters from "../store/station/getters";
import { AlertTypeForm } from "../components/ui/AlertTypeForm";
import { AlertTypeResponse, AlertTypeUpdate } from "../store/typealerts/state";
import { ListStationsResponse } from "../store/station/state";

interface Parameter {
  parameter_id: number;
  name_parameter: string;
  parameter_type_id: number;
}

const AlertTypePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type ExtendedAlertType = AlertTypeResponse & { station_id?: number };
  const [initialValues, setInitialValues] = useState<ExtendedAlertType | null>(null);

  const [stations, setStations] = useState<ListStationsResponse[]>([]);
  const [parameters, setParameters] = useState<{id: number, name_parameter: string}[]>([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const stationRes = await stationGetters.listStations();
        const alertRes = await typeAlertGetters.getAlertType(Number(id));

        if (stationRes.success && alertRes.success && stationRes.data && alertRes.data) {
          const alert = alertRes.data;

          const station = stationRes.data.find((s: ListStationsResponse) =>
            s.parameters?.some((p: Parameter) => p.parameter_id === alert.parameter_id)
          );

          const stationId = station?.id;

          const paramList = station
            ? station.parameters.map((p: Parameter) => ({
                id: p.parameter_id,
                name_parameter: p.name_parameter,
              }))
            : [];

          setStations(stationRes.data);
          setParameters(paramList);

          setInitialValues({
            ...alert,
            station_id: stationId,
          });
        } else {
          setError("Não foi possível carregar as informações do tipo de alerta. Verifique a existência da estação e dos parâmetros vinculados.");
        }
      } catch (err) {
        console.error("Erro ao carregar dados do tipo de alerta", err)
        setError("Ocorreu um erro inesperado ao tentar carregar os dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (id && !hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, [id]);

  const handleSubmit = async (form: AlertTypeUpdate) => {
    if (!id) return;

    const res = await typeAlertGetters.updateAlertType(Number(id), form);

    if (res.success) {
      setEditMode(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!id) return;

    const res = await typeAlertGetters.deactivateAlertType(Number(id));

    if (res.success) {
      location.reload();
    }
  };

  if (loading) {
    return (
      <LoggedLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </LoggedLayout>
    );
  }

  if (error || !initialValues) {
    return (
      <LoggedLayout>
        <Box margin={2}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" color="error">{error || "Tipo de alerta não encontrado."}</Typography>
            <Button variant="contained" onClick={() => navigate("/list-alert-type")}>Voltar</Button>
          </Paper>
        </Box>
      </LoggedLayout>
    );
  }

  return (
    <LoggedLayout>
      <AlertTypeForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        title="Tipo de Alerta"
        submitLabel="Salvar"
        stations={stations}
        parameters={parameters}
        setParameters={setParameters}
        disabled={!editMode}
        actionButtons={
          !editMode ? (
            <>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
              sx={{ backgroundColor: "#5f5cd9", color: "white", marginRight: 2 }}
            >
              Editar
            </Button>
            <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => window.history.back()}
            className="type-parameter-btn"
            sx={{ marginRight: "10px" }}
          >
            Voltar
          </Button>
          </>
          ) : (
            <Box>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => setEditMode(false)}
                sx={{ mr: 1 }}
              >
                Cancelar
              </Button>

              {initialValues.is_active && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<BlockOutlined />}
                  onClick={handleToggleStatus}
                  sx={{ mr: 1, color: "white" }}
                >
                  Desativar
                </Button>
              )}

              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() =>
                  document.querySelector("form")?.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  )
                }
                sx={{ backgroundColor: "#5f5cd9", color: "white" }}
              >
                Salvar
              </Button>
              
            </Box>
          )
        }
      />
    </LoggedLayout>
  );
};

export default AlertTypePage;