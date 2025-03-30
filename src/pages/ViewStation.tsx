import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { StationForm } from "../components/StationForm";
import { links } from "../services/api";
import "./styles/registerstation.css";

const ViewStation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [station, setStation] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDisablePopup, setShowDisablePopup] = useState(false);
  const [showActivatePopup, setShowActivatePopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        setLoading(true);
        const response = await links.getStation(Number(id));
        if (response.success) {
          setStation(response.data);
        } else {
          alert(response.error || "Erro ao carregar estação.");
        }
      } catch (error: any) {
        console.error("Erro ao carregar estação:", error);
        if (error.response?.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          navigate("/login");
        } else {
          alert("Erro ao carregar estação.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStation();
  }, [id, navigate]);

  const handleUpdate = async (form: any) => {
    try {
      const updatedFields: Partial<any> = {};

      if (form.name && form.name !== station.name) updatedFields.name = form.name;
      if (form.uid && form.uid !== station.uid) updatedFields.uid = form.uid;
      if (form.latitude && form.latitude !== String(station.latitude)) {
        updatedFields.latitude = parseFloat(form.latitude);
      }
      if (form.longitude && form.longitude !== String(station.longitude)) {
        updatedFields.longitude = parseFloat(form.longitude);
      }
      if (form.address && JSON.stringify(form.address) !== JSON.stringify(station.address)) {
        updatedFields.address = form.address;
      }
      if (
        form.parameter_types &&
        JSON.stringify(form.parameter_types) !== JSON.stringify(station.parameter_types)
      ) {
        updatedFields.parameter_types = form.parameter_types;
      }

      if (Object.keys(updatedFields).length === 0) {
        alert("Nenhuma alteração foi feita.");
        setIsEditing(false);
        return;
      }

      const response = await links.updateStation(Number(id), updatedFields);

      if (response.success) {
        alert("Estação atualizada com sucesso!");
        setIsEditing(false);
        setStation({ ...station, ...updatedFields });
      } else {
        alert(response.error || "Erro ao atualizar estação.");
      }
    } catch (error) {
      console.error("Erro ao atualizar estação:", error);
      alert("Erro ao atualizar estação.");
    }
  };

  const handleDisable = async () => {
    try {
      const response = await links.disableStation(Number(id));
      if (response.success) {
        alert("Estação desativada com sucesso!");
        setStation({ ...station, is_active: false });
        setShowDisablePopup(false);
      } else {
        alert(response.error || "Erro ao desativar estação.");
      }
    } catch (error) {
      console.error("Erro ao desativar estação:", error);
      alert("Erro ao desativar estação.");
    }
  };

  const handleActivate = async () => {
    try {
      const response = await links.activateStation(Number(id));
      if (response.success) {
        alert("Estação ativada com sucesso!");
        setStation({ ...station, is_active: true });
        setShowActivatePopup(false);
      } else {
        alert(response.error || "Erro ao ativar estação.");
      }
    } catch (error) {
      console.error("Erro ao ativar estação:", error);
      alert("Erro ao ativar estação.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!station) {
    return (
      <Typography variant="h6" align="center" mt={3}>
        Estação não encontrada.
      </Typography>
    );
  }

  return (
    <LoggedLayout>
      <Box className="estacao-wrapper">
        <Paper className="estacao-card">
          <Typography variant="h4" align="center" className="estacao-title">
            {isEditing ? "Editar Estação" : "Visualizar Estação"}
          </Typography>

          <Box className="estacao-form">
            <StationForm
              initialValues={station}
              onSubmit={isEditing ? handleUpdate : undefined}
              submitLabel="Salvar Alterações"
              readOnly={!isEditing}
              title=""
              withCardLayout={false}
            />

            <Box mt={3} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={() => setIsEditing(false)}
                    className="estacao-btn"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      station.is_active ? setShowDisablePopup(true) : setShowActivatePopup(true)
                    }
                    style={{
                      backgroundColor: station.is_active ? "#d32f2f" : "#2e7d32",
                      color: "#fff",
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                    className="estacao-btn"
                  >
                    {station.is_active ? "Desativar" : "Ativar"}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  className="estacao-btn"
                >
                  Editar
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

      <Dialog open={showDisablePopup} onClose={() => setShowDisablePopup(false)}>
        <DialogTitle>Confirmar Desativação</DialogTitle>
        <DialogContent>
          Tem certeza de que deseja desativar esta estação?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDisablePopup(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDisable} color="secondary">
            Desativar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showActivatePopup} onClose={() => setShowActivatePopup(false)}>
        <DialogTitle>Confirmar Ativação</DialogTitle>
        <DialogContent>
          Tem certeza de que deseja ativar esta estação?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowActivatePopup(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleActivate} color="success">
            Ativar
          </Button>
        </DialogActions>
      </Dialog>
    </LoggedLayout>
  );
};

export default ViewStation;
