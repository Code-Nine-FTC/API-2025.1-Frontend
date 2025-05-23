import { Box, Card, CardContent, CardHeader, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { LoggedLayout } from "../layout/layoutLogged";
import PizzaGraphic from "../components/graphics/pizzaGraphic";
import InfoIcon from "@mui/icons-material/Info";
import { StationStatusCard } from "../components/cards/stationStatusCard";
import { AlertCard } from "../components/cards/alertCard";
import { useEffect, useState } from "react";
import { StationStatusResponse, AlertCountsResponse } from "../store/dashboard/state"
import dashboardGetters from "../store/dashboard/getters";

const DashboardPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [alertCounts, setAlertCounts] = useState<AlertCountsResponse>();
    const [stationStatus, setStationStatus] = useState<StationStatusResponse>();
    const [formattedMeasure, setFormattedMeasure] = useState<{ name: string; y: number }[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [
                alertCountsResponse,
                stationStatusResponse,
                measureStatusResponse,
            ] = await Promise.all([
                dashboardGetters.getAlertCounts(),
                dashboardGetters.getStationStatus(),
                dashboardGetters.getMeasuresStatus(),
            ]);
    
            setAlertCounts(alertCountsResponse.data ?? {R: 0, Y: 0, G: 0});
            setStationStatus(stationStatusResponse.data ?? {total: 0, active: 0});

            const formattedData = measureStatusResponse.data?.map(item => ({
                name: item.name,  
                y: item.total  
            }));
            setFormattedMeasure(formattedData ?? []);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error fetching data:", error);
            setError(error.message || "Erro ao carregar dados");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography variant="h6">Carregando...</Typography>
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        )
    }

    return (
        <LoggedLayout>
            <Box
                sx={{
                    padding: { xs: 1, sm: 3 },
                    maxWidth: 1400,
                    margin: "0 auto",
                    bgcolor: "#f8f9fa",
                    minHeight: "100vh"
                }}
            >
                <Typography variant="h5" sx={{ mt: 5, mb: 2, fontWeight: 600 }}>
                    Alertas
                </Typography>
                <Stack
                    direction={{ xs: "column", sm: "column", lg: "row" }}
                    spacing={2}
                    width= {{ xs: "100%", md: "90%", lg: "100%" }} 
                    sx={{ mb: 4 }}
                    alignItems="stretch"
                >
                    <Box sx={{ flex: 1 }}>
                        <AlertCard type="R" count={alertCounts?.R ?? 0} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <AlertCard type="Y" count={alertCounts?.Y ?? 0} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <AlertCard type="G" count={alertCounts?.G ?? 0} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <StationStatusCard active={stationStatus?.active ?? 0} total={stationStatus?.total ?? 0} />
                    </Box>
                </Stack>

                <Stack
                    direction={{ xs: "column", md: "column", lg: "row" }}
                    spacing={2}
                    sx={{ mb: 4 }}
                    alignItems="stretch"
                >
                    <Box sx={{ flex: 3, width: { xs: "100%", md: "90%", lg: "70%" } }}>
                        <Card sx={{ boxShadow: 3, height: "100%", borderRadius: 3, p: 1 }}>
                            <CardHeader
                                title={<Typography variant="h6">Impacto de cada medida</Typography>}
                                action={
                                    <Tooltip title="Detalhes sobre a medida" arrow placement="top">
                                        <IconButton>
                                            <InfoIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            />
                            <CardContent>
                                <PizzaGraphic data={formattedMeasure} />
                            </CardContent>
                        </Card>
                    </Box>
                </Stack>
            </Box>
        </LoggedLayout>
    );
};

export default DashboardPage;