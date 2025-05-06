import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ListStationsResponse } from "../store/station/state";
import stationGetters from "../store/station/getters";
import StationHeader from "../components/ui/stationHeader";
import { useAuth } from "../components/authContext";
import { LoggedLayout } from "../layout/layoutLogged";
import DefaultLayout from "../layout/layoutNotLogged";
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Height } from "@mui/icons-material";

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
                alignItems: "flex-start",
                justifyContent: "center",
            }}
        >
            <StationHeader station={station}/>
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