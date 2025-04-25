import { Box, Card, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Tooltip, Typography } from "@mui/material";
import { LoggedLayout } from "../layout/layoutLogged";
import PizzaGraphic from "../components/graphics/pizzaGraphic";
import InfoIcon from "@mui/icons-material/Info";
import { StationStatusCard } from "../components/cards/stationStatusCard";
import { StationHistoric } from "../components/graphics/stationHistoric";
import { AlertCard } from "../components/cards/alertCard";
import { useEffect, useState } from "react";
import { StationStatusResponse, StationHistoricResponse, AlertCountsResponse, MeasuresStatusResponse} from "../store/dashboard/state"
import dashboardGetters from "../store/dashboard/getters";
import stationGetters from "../store/station/getters"
import {ListStationsResponse} from "../store/station/state"

// const measureStatus = [
//     {
//         label: "Medida 1",
//         value: 10,
//     },
//     {
//         label: "Medida 2",
//         value: 20,
//     },
//     {
//         label: "Medida 3",
//         value: 30,
//     },
//     {
//         label: "Medida 4",
//         value: 40,
//     }
// ]

// const alertCounts = {
//     R: 5,
//     Y: 8,
//     G: 15
//   };

// const stationStatus = {
// enabled: 12,
// total: 15
// };

// const historicData = Array.from({ length: 50 }, (_, i) => ([
//     { name: "Temperatura", value: (20 + Math.random() * 10), measure_unit: "C", measure_date: 1743537102 + i * 3 * 24 * 60 * 60 },
//     { name: "Pressão", value: (95 + Math.random() * 10), measure_unit: "Bar", measure_date: 1743537102 + i * 3 * 24 * 60 * 60 }
// ])).flat();

const DashboardPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [alertCounts, setAlertCounts] = useState<AlertCountsResponse>();
    const [stationStatus, setStationStatus] = useState<StationStatusResponse>();
    const [historicData, setHistoricData] = useState<StationHistoricResponse[]>([]);
    const [formattedMeasure, setFormattedMeasure] = useState<{ label: string; value: number }[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const [stations, setStations] = useState<ListStationsResponse[]>([]);
    const [selectedStation, setSelectedStation] = useState<string>("Todas");
    
    const fetchHistoricData = async () => {
        try {
            const historicResponse = await dashboardGetters.getStationHistoric(selectedStation === "Todas" ? undefined : Number(selectedStation));
            setHistoricData(historicResponse.data ?? []);
        } catch (err: any) {
            console.error("Error fetching historic data:", err);
            setError(err.message || "Erro ao carregar histórico");
        }
    };

    const fetchData = async () => {
        try {
            const [
                alertCountsResponse,
                stationStatusResponse,
                measureStatusResponse,
                stationsResponse
            ] = await Promise.all([
                dashboardGetters.getAlertCounts(),
                dashboardGetters.getStationStatus(),
                dashboardGetters.getMeasuresStatus(),
                stationGetters.listStations(),
            ]);
    
            setAlertCounts(alertCountsResponse.data ?? {R: 0, Y: 0, G: 0});
            setStationStatus(stationStatusResponse.data ?? {total: 0, active: 0});
            setStations(stationsResponse.data ?? []);

            const formattedData = measureStatusResponse.data?.map(item => ({
                label: item.name,  
                value: item.total  
            }));
            setFormattedMeasure(formattedData ?? []);

            await fetchHistoricData()

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
    
    useEffect(() => {
        if (!isLoading) {
            fetchHistoricData();
        }
    }, [selectedStation, isLoading]);
    
    function handleStationChange (event: SelectChangeEvent<string>) {
        setSelectedStation(event.target.value.toString());
    };

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
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
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
                </Stack>

                <Stack
                    direction={{ xs: "column", md: "column", lg: "row" }}
                    spacing={2}
                    sx={{ mb: 4 }}
                    alignItems="stretch"
                >
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 220,
                            width: { xs: "100%", md: "90%", lg: "30%" },
                            mb: { xs: 2, md: 0 }
                        }}
                    >
                        <Card sx={{ height: "100%", borderRadius: 3, p: 1 }}>
                            <CardHeader
                                title={<Typography variant="h6">Quantidade de estações</Typography>}
                            />
                            <CardContent>
                                <StationStatusCard active={stationStatus?.active ?? 0} total={stationStatus?.total ?? 0} />
                            </CardContent>
                        </Card>
                    </Box>
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

                <Box
                    sx={{
                        width: "100%",
                        overflowX: "auto",
                        pb: 2,
                        display: "flex",
                        justifyContent: { xs: "flex-start", md: "flex-start" }
                    }}
                >
                    <Card sx={{ boxShadow: 3, minWidth: 320, borderRadius: 3, p: 1, width: { xs: "100%", md: "90%", lg: "100%" } }}>
                        <CardHeader title={<Typography variant="h6">Histórico de parâmetros</Typography>}
                         action={
                            <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
                                <InputLabel id="station-select-label">Estação</InputLabel>
                                <Select
                                    labelId="station-select-label"
                                    id="station-select"
                                    value={selectedStation}
                                    label="Estação"
                                    onChange={handleStationChange}
                                >
                                    <MenuItem value="Todas">
                                        <em>Todas as Estações</em>
                                    </MenuItem>
                                    {stations.map((station) => (
                                        <MenuItem key={station.id} value={station.id}>
                                            {station.name_station}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }/>
                        <CardContent>
                            <StationHistoric data={historicData} />
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </LoggedLayout>
    );
};

export default DashboardPage;