import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ListStationsResponse } from "../store/station/state";
import stationGetters from "../store/station/getters";
import StationHeader from "../components/ui/stationHeader";
import { useAuth } from "../components/authContext";
import { LoggedLayout } from "../layout/layoutLogged";
import DefaultLayout from "../layout/layoutNotLogged";
import { Box, Button, CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AlertCard } from "../components/cards/alertCard";
import GaugeGraphic from "../components/graphics/gaugeGraphic";
import ThermometerGraphic from "../components/graphics/thermometerGraphic";
import DashboardGetters from "../store/dashboard/getters";
import BucketGraphic from "../components/graphics/bucketGraphic";

const alertCounts = {
    R: 0,
    Y: 0,
    G: 0,
};

export default function StationPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [station, setStation] = useState<ListStationsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const navigate = useNavigate();
    
    const [gaugeValue, setGaugeValue] = useState<number>(950); // Initial value for the gauge
    const [temperature, setTemperature] = useState<number>(0); // Initial value for the thermometer
    const [bucketValue, setBucketValue] = useState<number>(0); // Initial value for the bucket

    useEffect(() => {
        const fetchStation = async () => {
            try {
                const response = await stationGetters.getStation(Number(id));
                if (response.success && response.data) {
                    setStation(response.data);
                }
                else {
                    setError("Não foi possível carregar os dados da estação");
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido");
            } finally {
                setLoading(false);
            }
        };


        if (id) {
            fetchStation();
        }
    }, []);
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            const randomValue = Math.floor(Math.random() * (1050 - 950 + 1)) + 950;
            const randomTemperature = Math.floor(Math.random() * (50 - (-10) + 1)) + (-10);
            const randomBucket = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            setTemperature(randomTemperature);
            setGaugeValue(randomValue);
            setBucketValue(randomBucket);
        }, 10000); // 30 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    const content = (
        <Box sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <StationHeader station={station}/>
            <Box
              sx={{
                display: "flex",
                alignItems: "stretch",
                justifyContent: "center",
                width: "100%",
                padding: 2,
                gap: 2,
                paddingTop: { xs: 6, sm: 6, md: 2, lg: 2 },
              }}
              flexDirection={{ xs: "column", sm: "column", md: "row", lg: "row" }}
            >

              <Paper
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '48px',   
                    width: { xs: "100%", md: "80%", lg: "80%" },
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    boxSizing: 'border-box',
                    flexGrow: 3,
                  }}
                >
                  <Typography 
                    variant="h4" 
                    fontWeight='bold' 
                    color="rgb(146, 123, 230)"
                  >
                    Dashboard da Estação
                  </Typography>
                  <Divider sx={{ margin: '16px 0' }} />
                  
                  <Stack 
                    direction={{ xs: 'column', sm: 'column', md: 'row' }} 
                    spacing={4} flexWrap="wrap" 
                    justifyContent="space-evenly" 
                    alignItems="center"
                    width= {{ xs: "100%", sm: '100%', md: "80%", lg: "100%" }}>
                    <Box sx={{ minWidth: 260, flex: 1 }}>
                      <GaugeGraphic title="Pressão atmosférica" value={gaugeValue} min={950} max={1050} unit="hPa" measureDate="1747092258"/>
                    </Box>
                    <Box sx={{ minWidth: 260, flex: 1 }}>
                      <ThermometerGraphic title="Temperatura" value={temperature ?? 0} min={-30} max={60} unit="°C" measureDate="1747092258"/>
                    </Box>
                    <Box sx={{ minWidth: 260, flex: 1 }}>
                      <BucketGraphic title="Umidade do ar" value={bucketValue ?? 0} min={0} max={100} unit="%" measureDate="1747092258"/>
                    </Box>
                </Stack>
              </Paper>
              <Paper
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: { xs: "100%", sm: "100%", md: 'fit-content', lg: 'fit-content' },
                    flexGrow: 1,
                    paddingTop: '10px',
                    borderRadius: '16px',
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ mb: 2, fontWeight: 600 }} 
                    align="center"
                    color="rgb(146, 123, 230)"
                  >
                      Alertas
                  </Typography>
                  <Stack
                      direction="column"
                      spacing={2}
                      width= {{ xs: "90%", md: "80%", lg: "80%" }} 
                      sx={{ mb: 4 }}
                      alignItems="stretch"
                  >
                      <Box>
                          <AlertCard type="R" count={alertCounts?.R ?? 0} />
                      </Box>
                      <Box>
                          <AlertCard type="Y" count={alertCounts?.Y ?? 0} />
                      </Box>
                      <Box>
                          <AlertCard type="G" count={alertCounts?.G ?? 0} />
                      </Box>
                  </Stack>
              </Paper>
          </Box>
        </Box>
    )
    
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

    return auth.isAuthenticated ? (
        <LoggedLayout>
            {content}
        </LoggedLayout>
    ) : (
        <DefaultLayout>
            {content}
        </DefaultLayout>
    )
}