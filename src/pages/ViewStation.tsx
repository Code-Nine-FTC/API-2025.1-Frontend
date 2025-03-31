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
          const apiData = response.data.data;

          const formattedData = {
            name: apiData.name_station || "",  // Using name_station instead of name
            uid: apiData.uid || "",
            // Address fields - extract from address object
            city: apiData.address?.city || "",
            state: apiData.address?.state || "",
            country: apiData.address?.country || "Brasil",
            // Convert numbers to strings for form fields
            latitude: String(apiData.latitude || ""),
            longitude: String(apiData.longitude || ""),
            // Use parameters array instead of parameter_types
            parameter_types: Array.isArray(apiData.parameters) 
              ? apiData.parameters.map((p: any) => ({
                  type: String(p.id || p),
                  unit: p.measure_unit || ""
                }))
              : [],
            // Store the is_active status
            is_active: apiData.status !== undefined ? apiData.status : true,
            // Preserve original data for comparison when updating
            original: apiData
          };
          // Set the station data to state
          setStation(formattedData);
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
      const original = station.original;
      const updatedFields: Partial<any> = {};

      if (form.name && form.name !== original.name_station) {
        updatedFields.name = form.name;
      }
      
      // Check other fields
      if (form.uid && form.uid !== original.uid) {
        updatedFields.uid = form.uid;
      }
      
      if (form.latitude && parseFloat(form.latitude) !== original.latitude) {
        updatedFields.latitude = parseFloat(form.latitude);
      }
      
      if (form.longitude && parseFloat(form.longitude) !== original.longitude) {
        updatedFields.longitude = parseFloat(form.longitude);
      }
      
      // Build address object from form fields
      const formAddress = {
        city: form.city || "",
        state: form.state || "",
        country: form.country || ""
      };
      
      // Compare address objects
      if (JSON.stringify(formAddress) !== JSON.stringify(original.address)) {
        updatedFields.address = formAddress;
      }
      
      // Handle parameter types/parameters - we need to format these correctly
      if (form.parameter_types && Array.isArray(form.parameter_types)) {
        console.log("Raw parameter_types:", JSON.stringify(form.parameter_types));
        
        // Create a new array with only valid parameter IDs
        const validParams = [];
        for (const param of form.parameter_types) {
          if (param && param.type && !isNaN(parseInt(param.type, 10))) {
            validParams.push(parseInt(param.type, 10));
          }
        }
        
        console.log("Valid parameters after filtering:", validParams);
        
        // Get original parameter IDs with safer approach
        const originalParamIds = [];
        if (Array.isArray(original.parameters)) {
          for (const param of original.parameters) {
            if (param && (param.id || parseInt(param, 10))) {
              originalParamIds.push(param.id || parseInt(param, 10));
            }
          }
        }

        console.log("Original parameter IDs:", originalParamIds);

        const sortedValidParams = [...validParams].sort();
        const sortedOriginalParams = [...originalParamIds].sort();
        
        if (JSON.stringify(sortedValidParams) !== JSON.stringify(sortedOriginalParams)) {
          updatedFields.parameter_types = validParams;
        }
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
        setStation({
          ...station,
          name: form.name,
          uid: form.uid,
          city: form.city,
          state: form.state,
          country: form.country,
          latitude: form.latitude,
          longitude: form.longitude,
          parameter_types: form.parameter_types,
          original: {
            ...station.original,
            name_station: form.name,
            uid: form.uid,
            address: {
              city: form.city,
              state: form.state,
              country: form.country
            },
            latitude: parseFloat(form.latitude),
            longitude: parseFloat(form.longitude)
          }
        });
      } else {
          console.error("Update failed:", response);
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
