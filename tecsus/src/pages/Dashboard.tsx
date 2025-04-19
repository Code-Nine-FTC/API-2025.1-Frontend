import { Box, Card, CardContent, CardHeader, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { LoggedLayout } from "../layout/layoutLogged";
import PizzaGraphic from "../components/graphics/pizzaGraphic";
import InfoIcon from "@mui/icons-material/Info";
import { StationStatusCard } from "../components/cards/stationStatusCard";
import { StationHistoric } from "../components/graphics/stationHistoric";
import { AlertCard } from "../components/cards/alertCard";

const dadosTeste = [
    {
        label: "Medida 1",
        value: 10,
    },
    {
        label: "Medida 2",
        value: 20,
    },
    {
        label: "Medida 3",
        value: 30,
    },
    {
        label: "Medida 4",
        value: 40,
    }
]

const alertCounts = {
    R: 5,
    Y: 8,
    G: 15
  };

const stationStatus = {
enabled: 12,
total: 15
};

const historicData = [
    { name: "Temperatura", value: "23", measure_unit: "C", measure_date: 1743537102 },
    { name: "Pressão", value: "100", measure_unit: "Bar", measure_date: 1743537102 },
    { name: "Temperatura", value: "25", measure_unit: "C", measure_date: 1743537202 },
    { name: "Pressão", value: "102", measure_unit: "Bar", measure_date: 1743537202 }
  ];

const DashboardPage = () => {
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
                {/* Alert Cards */}
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Alertas
                </Typography>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ mb: 4 }}
                    alignItems="stretch"
                >
                    <Box sx={{ flex: 1 }}>
                        <AlertCard type="R" count={alertCounts.R} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <AlertCard type="Y" count={alertCounts.Y} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <AlertCard type="G" count={alertCounts.G} />
                    </Box>
                </Stack>

                {/* Middle Row */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ mb: 4 }}
                    alignItems="stretch"
                >
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 220,
                            width: { xs: "100%", md: "30%" },
                            mb: { xs: 2, md: 0 }
                        }}
                    >
                        <Card sx={{ height: "100%", borderRadius: 3, p: 1 }}>
                            <CardHeader
                                title={<Typography variant="h6">Estações ativas</Typography>}
                            />
                            <CardContent>
                                <StationStatusCard active={stationStatus.enabled} total={stationStatus.total} />
                            </CardContent>
                        </Card>
                    </Box>
                    <Box sx={{ flex: 3, width: { xs: "100%", md: "70%" } }}>
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
                                <PizzaGraphic data={dadosTeste} />
                            </CardContent>
                        </Card>
                    </Box>
                </Stack>

                {/* Historic Data Section */}
                <Box
                    sx={{
                        width: "100%",
                        overflowX: "auto",
                        pb: 2,
                        display: "flex",
                        justifyContent: { xs: "flex-start", md: "center" }
                    }}
                >
                    <Card sx={{ boxShadow: 3, minWidth: 320, borderRadius: 3, p: 1, width: { xs: "100%", md: "80%" } }}>
                        <CardHeader title={<Typography variant="h6">Histórico de parâmetros</Typography>} />
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