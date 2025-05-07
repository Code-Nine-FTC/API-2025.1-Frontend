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