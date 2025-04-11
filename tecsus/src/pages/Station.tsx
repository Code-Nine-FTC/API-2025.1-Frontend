import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoggedLayout } from "../layout/layoutLogged";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Divider, 
  Grid, 
  Paper, 
  TextField, 
  Typography,
  Alert
} from "@mui/material";
import stationGetters from "../store/station/getters";
import { ListStationsResponse } from "../store/station/state";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from "../components/authContext";
import { BlockOutlined, Check } from "@mui/icons-material";

const StationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [station, setStation] = useState<ListStationsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const[name, setName] = useState<string>("")
  const[uid, setUid] = useState<string>("")
  const[city, setCity] = useState<string>("")
  const[state, setState] = useState<string>("")
  const[country, setCountry] = useState<string>("")
  const[latitude, setLatitude] = useState<number>(0)
  const[longitude, setLongitude] = useState<number>(0)
  const[status, setStatus] = useState<boolean>(true)
//   const[parameters, setParameters] = useState>([])

  const auth = useAuth();

  useEffect(() => {
    async function fetchStationDetails() {
      try {
        setLoading(true);

        const response = await stationGetters.getStation(Number(id));
        
        if (response.success && response.data) {
            setStation(response.data);
            setName(response.data.name_station);
            setUid(response.data.uid);
            setStatus(response.data.is_active);
            setCity(response.data.address?.city || "");
            setState(response.data.address?.state || "");
            setCountry(response.data.address?.country || "");
            setLatitude(response.data.latitude);
            setLongitude(response.data.longitude);
            
        } else {
          setError("Não foi possível carregar os detalhes da estação.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchStationDetails();
    }
  }, []);

  const handleSave = async () => {
    // try {
    //   setLoading(true);
    //   // Assuming you have an updateStation method
    //   const response = await stationGetters);
      
    //   if (response.success) {
    //     setStation(response.data);
    //     setEditMode(false);
    //   } else {
    //     setError("Erro ao atualizar a estação.");
    //   }
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : "Ocorreu um erro ao salvar as alterações");
    // } finally {
    //   setLoading(false);
    // }
  };

  async function handleDeactivate() {
    try {
      setLoading(true);
      const response = await stationGetters.deactivateStation(Number(id));
      if (response.success) {
        setEditMode(false);
        setLoading(false);
        location.reload()

      } else {
        setError("Erro ao desativar a estação.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao desativar a estação");
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

  if (error || !station) {
    return (
      <LoggedLayout>
        <Box margin={2}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" color="error" gutterBottom>
              {error || "Estação não encontrada"}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/list-station")}
            >
              Voltar
            </Button>
          </Paper>
        </Box>
      </LoggedLayout>
    );
  }

  return (
    <LoggedLayout>
      <Box className="estacao-wrapper">
        <Paper className="estacao-card">
          <Typography variant="h4" align="center" className="estacao-title">
            {editMode ? "Editar Estação" : "Detalhes da Estação"}
          </Typography>
          <form
            className="estacao-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className={"input-group-wrapper"}>
              <div className="input-group">
                <label className="input-label">
                  <strong>Nome da estação</strong>
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editMode}
                  className="input-field"
                />
              </div>
            </div>
            <div className={"input-group-wrapper"}>
              <div className="input-group">
                <label className="input-label">
                  <strong>UID</strong>
                </label>
                <input
                  type="text"
                  name="uid"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  disabled={!editMode}
                  className="input-field"
                />
              </div>
            </div>
            <div className="row">
              <div className={"input-group-wrapper input-bairro"}>
                <div className="input-group">
                  <label className="input-label">
                    <strong>País</strong>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={!editMode}
                    className="input-field"
                  />
                </div>
              </div>
              <div className={"input-group-wrapper input-cidade"}>
                <div className="input-group">
                  <label className="input-label">
                    <strong>Cidade</strong>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!editMode}
                    className="input-field"
                  />
                </div>
              </div>
              <div className={"input-group-wrapper input-tiny"}>
                <div className="input-group">
                  <label className="input-label">
                    <strong>Estado</strong>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={!editMode}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className={"input-group-wrapper input-coord"}>
                <div className="input-group">
                  <label className="input-label">
                    <strong>Latitude</strong>
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    disabled={!editMode}
                    className="input-field"
                  />
                </div>
              </div>
              <div className={"input-group-wrapper input-coord"}>
                <div className="input-group">
                  <label className="input-label">
                    <strong>Longitude</strong>
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    disabled={!editMode}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
            <Box mt={3} textAlign="center">
              {!editMode ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                  className="estacao-btn"
                  style={{ backgroundColor: "#5f5cd9", color: "white" }}
                >
                  Editar
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => setEditMode(false)}
                    className="estacao-btn"
                    sx={{ 
                      marginRight: "10px",
                      "&:hover": { color: "white" },
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    color={status? "error" : "success"}
                    startIcon={status? <BlockOutlined /> : <Check/>}
                    onClick={() => handleDeactivate()}
                    className="estacao-btn"
                    sx={{ 
                      "&:hover": { backgroundColor: status? "#c9302c" : "rgb(45, 186, 2)" }, 
                      mr: "10px", 
                      color: "white" 
                    }}
                  >
                    {status? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    type="submit"
                    className="estacao-btn"
                    style={{ backgroundColor: "#5f5cd9", color: "white" }}
                  >
                    Salvar
                  </Button>
                </>
              )}
            </Box>
          </form>
        </Paper>
      </Box>
    </LoggedLayout>
  );
};

export default StationPage;