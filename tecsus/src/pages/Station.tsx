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
  Alert,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent
} from "@mui/material";
import stationGetters from "../store/station/getters";
import { ListStationsResponse, UpdateStation } from "../store/station/state";
import parameterGetters from "../store/typeparameters/getters";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from "../components/authContext";
import { BlockOutlined, Check } from "@mui/icons-material";
import DefaultLayout from "../layout/layoutNotLogged";
import { GridDeleteIcon } from "@mui/x-data-grid";

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
  const[parameters, setParameters] = useState<Array<{
    parameter_id: number;
    name_parameter: string;
    parameter_type_id: number;
  }>>([]);

  const [allParameters, setAllParameters] = useState<Array<{
    id: number; 
    name: string;
  }>>([]);

  const [selectedParameters, setSelectedParameters] = useState<number[]>([]);

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

            if (response.data.parameter_types) {
              setParameters(response.data.parameter_types);
              setSelectedParameters(response.data.parameter_types.map((param) => param.parameter_id));
            }

            setStation(response.data);
            
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

  useEffect(() => {
    console.log("estacao", station);
  }, [station]);

  async function fetchAllParameters() {
    try {
      const response = await parameterGetters.listParameterTypes();
      if (response.success) {
        setAllParameters(response.data || []);
      } else {
        setError("Erro ao carregar parâmetros.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatedStation: UpdateStation = {}

      const address: {city?: string; state?: string; country?: string} = {}

      if (name != station?.name_station) updatedStation.name = name;
      if (uid != station?.uid) updatedStation.uid = uid;
      if (latitude != station?.latitude) updatedStation.latitude = latitude;
      if (longitude != station?.longitude) updatedStation.longitude = longitude;
      if (city != station?.address?.city) address.city = city;
      if (state != station?.address?.state) address.state = state;
      if (country != station?.address?.country) address.country = country;

      if (Object.keys(address).length > 0) updatedStation.address = address;

      const response = await stationGetters.updateStation(Number(id), updatedStation);
      
      if (response.success) {
        setStation(response.data);
        setEditMode(false);
        setLoading(false);
        setError(null);
        location.reload()
      } else {
        setError("Erro ao atualizar a estação.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao salvar as alterações");
    } finally {
      setLoading(false);
    }
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
  
  async function handleRemoveParameter(parameterId: number) {
    try {
      setLoading(true);
      const response = await stationGetters.removeParameter(Number(id), parameterId);
      
      if (response.success) {
        const updatedParameters = parameters.filter(param => param.parameter_id !== parameterId);
        setParameters(updatedParameters);
        setSelectedParameters(prev => prev.filter(id => id !== parameterId));
        setError(null);
      } else {
        setError("Erro ao remover o parâmetro.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao remover o parâmetro");
    } finally {
      setLoading(false);
    }
  }

  function handleParameterChange(event: SelectChangeEvent<number[]>) {
    const value = event.target.value as number[];
    setSelectedParameters(value);
  }

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

  const content = (
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
              
                <div className={"input-group-wrapper"} style={{ width: "100%" }}>
                  <div className="input-group">
                    <label className="input-label">
                      <strong>Parâmetros</strong>
                    </label>
                    
                    {/* Show parameter badges with X for removal when not in edit mode */}
                    {!editMode && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                        {parameters.length > 0 ? (
                          parameters.map((param) => (
                            <Chip
                              key={param.parameter_id}
                              label={param.name_parameter}
                              sx={{ 
                                backgroundColor: "#5f5cd9",
                                color: "white",
                              }}
                            />
                          ))
                        ) : (
                          <Typography sx={{ color: '#666' }}>Nenhum parâmetro vinculado</Typography>
                        )}
                      </div>
                    )}
                    
                    {/* Show multi-select dropdown and badges with delete in edit mode */}
                    {editMode && (
                      <>
                        <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
                          <InputLabel id="parameter-select-label">Selecione os parâmetros</InputLabel>
                          <Select
                            labelId="parameter-select-label"
                            id="parameter-select"
                            multiple
                            onClick={() => fetchAllParameters()}
                            value={selectedParameters}
                            onChange={handleParameterChange}
                            input={<OutlinedInput label="Selecione os parâmetros" />}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((paramTypeId) => {
                                  const param = allParameters.find(p => p.id === paramTypeId);
                                  return (
                                    <Chip 
                                      key={paramTypeId} 
                                      label={param?.name || `Parâmetro ${paramTypeId}`} 
                                      sx={{ backgroundColor: "#5f5cd9", color: "white" }}
                                    />
                                  );
                                })}
                              </Box>
                            )}
                          >
                            {allParameters.map((param) => (
                              <MenuItem key={param.id} value={param.id}>
                                {param.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                          {parameters.map((param) => (
                            <Chip
                              key={param.parameter_id}
                              label={param.name_parameter}
                              onDelete={() => handleRemoveParameter(param.parameter_type_id)}
                              deleteIcon={<GridDeleteIcon style={{ color: 'white' }} />}
                              sx={{ 
                                backgroundColor: "#5f5cd9",
                                color: "white",
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

            {auth.isAuthenticated && (
              
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
          )}
          </form>
        </Paper>
      </Box>
  );
  
  return auth.isAuthenticated ? (
      <LoggedLayout>
        {content}
      </LoggedLayout>
    ):
    (
      <DefaultLayout>
        {content}
      </DefaultLayout>
    )
};

export default StationPage;