import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "../../pages/styles/registerstation.css";
import stationGetters from "../../store/station/getters";
import parameterTypeGetters from "../../store/typeparameters/getters";

export default function RegisterStationForm() {
  const [name, setName] = useState<string>("");
  const [uid, setUid] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [parameterTypes, setParameterTypes] = useState<number[]>([]);
  const [availableParameters, setAvailableParameters] = useState<
    Array<{ id: number; name: string }>
  >([]);

  useEffect(() => {
    async function buscarParametros() {
      try {
        const response = await parameterTypeGetters.listParameterTypes();
        if (response.success) {
          setAvailableParameters(response.data || []);
        }
      } catch (error) {
        console.error("Erro ao buscar parâmetros:", error);
      }
    }
    buscarParametros();
  }, []);

  async function handleCreate() {
    const stationData = {
      name: name,
      uid: uid,
      address: {
        country: country,
        city: city,
        state: state,
      },
      latitude: Number(latitude),
      longitude: Number(longitude),
      parameter_types: parameterTypes,
    };

    try {
      const resultado = await stationGetters.registerStation(stationData);
      if (resultado.success) {
        alert("Estação cadastrada com sucesso!");
      } else {
        alert("Erro ao cadastrar estação");
      }
    } catch (err: any) {
      alert(`Erro ao cadastrar estação`);
    }
  }

  function handleParameterChange(event: SelectChangeEvent<number[]>) {
    const { value } = event.target;
    setParameterTypes(
      typeof value === "string" ? value.split(",").map(Number) : value
    );
  }

  return (
    <Box className="estacao-wrapper">
      <Paper className="estacao-card">
        <Typography variant="h4" align="center" className="estacao-title">
          Cadastrar Estação
        </Typography>
        <form
          className="estacao-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <div className={"input-group-wrapper"}>
            <div className="input-group">
              <label className="input-label">
                <strong>Nome da estação</strong>
              </label>
              <input
                type="text"
                name={name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
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
                name={uid}
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                required
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
                  name={country}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
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
                  name={city}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
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
                  name={state}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
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
                  name={latitude}
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
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
                  name={longitude}
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <FormControl className="input-group-wrapper" fullWidth>
              <InputLabel id="parameter-types-label">Parâmetros</InputLabel>
              <Select
                labelId="parameter-types-label"
                id="parameter-types"
                multiple
                value={parameterTypes}
                onChange={handleParameterChange}
                input={
                  <OutlinedInput
                    id="select-multiple-parameters"
                    label="Parâmetros"
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const parameter = availableParameters.find(
                        (p) => p.id === value
                      );
                      return (
                        <Chip
                          key={value}
                          label={parameter ? parameter.name : value}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {availableParameters.map((parameter) => (
                  <MenuItem key={parameter.id} value={parameter.id}>
                    {parameter.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              type="submit"
              className="estacao-btn"
              style={{ backgroundColor: "#5f5cd9", color: "white" }}
            >
              Cadastrar
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.history.back()}
              className="type-parameter-btn"
              sx={{ marginRight: "10px", margin: 2 }}
            >
              Voltar
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
