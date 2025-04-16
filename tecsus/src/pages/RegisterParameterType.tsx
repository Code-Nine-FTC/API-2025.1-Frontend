import { Box, Paper, Typography, Button, TextField } from "@mui/material";
import { LoggedLayout } from "../layout/layoutLogged";
import { useState } from "react";
import typeParameterGetters from "../store/typeparameters/getters";
import { ParameterTypeCreate } from "../store/typeparameters/state";

function RegisterParameterType() {
  const [name, setName] = useState("");
  const [offset, setOffset] = useState("");
  const [factor, setFactor] = useState("");
  const [detectType, setDetectType] = useState("");
  const [measureUnit, setMeasureUnit] = useState("");
  const [qntDecimals, setQntDecimals] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data: ParameterTypeCreate = {
      name: name,
      measure_unit: measureUnit,
      is_active: true,
      offset: offset ? parseFloat(offset) : 0,
      factor: factor ? parseFloat(factor) : 0,
      detect_type: detectType,
      qnt_decimals: qntDecimals,
    };
    const response = await typeParameterGetters.createParameterType(data);
    if (response.success) {
      alert("Tipo de parâmetro criado com sucesso!");
      cleanInput();
    } else {
      alert("Erro ao criar tipo de parâmetro: " + response.error);
    }
  }

  function cleanInput() {
    setName("");
    setOffset("");
    setFactor("");
    setDetectType("");
    setMeasureUnit("");
    setQntDecimals(0);
  }

  return (
    <LoggedLayout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f2f5",
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: "60%",
            p: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              textAlign: "center",
              color: "#5f5cd9",
              fontWeight: "bold",
              fontSize: "2rem",
            }}
          >
            Cadastrar Tipo de Parâmetro
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <TextField
                fullWidth
                label="Nome"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ backgroundColor: "white" }}
              />

              <TextField
                fullWidth
                label="Unidade de Medida"
                variant="outlined"
                value={measureUnit}
                onChange={(e) => setMeasureUnit(e.target.value)}
                required
                sx={{ backgroundColor: "white" }}
              />

              <TextField
                fullWidth
                label="Offset"
                variant="outlined"
                type="number"
                value={offset}
                onChange={(e) => setOffset(e.target.value)}
                required
                sx={{ backgroundColor: "white" }}
              />

              <TextField
                fullWidth
                label="Fator"
                variant="outlined"
                type="number"
                value={factor}
                onChange={(e) => setFactor(e.target.value)}
                required
                sx={{ backgroundColor: "white" }}
              />

              <TextField
                fullWidth
                label="Tipo de Detecção"
                variant="outlined"
                value={detectType}
                onChange={(e) => setDetectType(e.target.value)}
                required
                sx={{ backgroundColor: "white" }}
              />

              <TextField
                fullWidth
                label="Casas Decimais"
                variant="outlined"
                type="number"
                value={qntDecimals}
                onChange={(e) => setQntDecimals(parseInt(e.target.value))}
                required
                sx={{ backgroundColor: "white" }}
              />
            </Box>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#5f5cd9",
                  color: "white",
                  px: 6,
                  py: 1.5,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  "&:hover": {
                    backgroundColor: "#4a48b5",
                    boxShadow: "0px 4px 12px rgba(95, 92, 217, 0.4)",
                  },
                }}
              >
                Cadastrar
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </LoggedLayout>
  );
}

export default RegisterParameterType;