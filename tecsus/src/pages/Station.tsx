import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ListStationsResponse } from "../store/station/state";
import stationGetters from "../store/station/getters";
import StationHeader from "../components/ui/stationHeader";
import { useAuth } from "../components/authContext";
import { LoggedLayout } from "../layout/layoutLogged";
import DefaultLayout from "../layout/layoutNotLogged";
import { Box, Button, CircularProgress, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AlertCard } from "../components/cards/alertCard";
import GaugeGraphic from "../components/graphics/gaugeGraphic";
import ThermometerGraphic from "../components/graphics/thermometerGraphic";
import dashboardGetters from "../store/dashboard/getters";
import BucketGraphic from "../components/graphics/bucketGraphic";
import VelocimeterGraphic from "../components/graphics/velocimeterGraphic";
import PizzaGraphic from "../components/graphics/pizzaGraphic";
import LineGraphic from "../components/graphics/stationHistoric";
import { AlertCountsResponse, LastMeasureResponse, StationHistoricResponse } from "../store/dashboard/state";

type PredefinedRangeKey = "7d" | "30d" | "3m" | "6m" | "1y" | "all" | "custom";

interface RangeOption {
    key: PredefinedRangeKey;
    label: string;
}
interface TemperatureProps {
  min: number;
  max: number;
  unit: string;
}

export default function StationPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [station, setStation] = useState<ListStationsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const navigate = useNavigate();
    
    const [alertCounts, setAlertCounts] = useState<AlertCountsResponse>();
    const [measureStatus, setMeasureStatus] = useState<{ name: string; y: number }[]>([]);
    const [lastMeasures, setLastMeasures] = useState<LastMeasureResponse[]>([]);
    const [temperatureProps, setTemperatureProps] = useState<TemperatureProps | null>(null);
    
    const [historicData, setHistoricData] = useState<StationHistoricResponse[]>([]);
    const [historicDataLoading, setHistoricDataLoading] = useState(true);
    const [historicDataError, setHistoricDataError] = useState<string | null>(null);
    const [loadedRange, setLoadedRange] = useState<{start: Date, end: Date} | null>(null);
    const [cachedData, setCachedData] = useState<Map<string, StationHistoricResponse[]>>(new Map());
    
    const [selectedRangeKey, setSelectedRangeKey] = useState<PredefinedRangeKey>("7d");
    const [customStartDate, setCustomStartDate] = useState<string>("");
    const [customEndDate, setCustomEndDate] = useState<string>("");

    const rangeOptions: RangeOption[] = [
      { key: "7d", label: "Ultima semana" },
      { key: "30d", label: "Ultimo mês" },
      { key: "3m", label: "Ultimos 3 meses" },
      { key: "6m", label: "Ultimos 6 meses" },
      { key: "1y", label: "Ultimo ano" },
      { key: "all", label: "Todo o tempo" },
      { key: "custom", label: "Customizado" },
    ];

    const fetchHistoricDataWithCaching = useCallback(async (start?: Date, end?: Date) => {
        if (!id) {
          console.error("ID da estação não encontrado");
          setHistoricDataLoading(false);
          return;
        }
        setHistoricDataLoading(true);
        setHistoricDataError(null);

        const cacheKey = (start && end) 
            ? `${start.toISOString()}_${end.toISOString()}` 
            : (!start && !end) ? "all_time" : `start_${start?.toISOString()}_end_${end?.toISOString()}`; 

        if (cachedData.has(cacheKey)) {
            const cachedResponse = cachedData.get(cacheKey);
            setHistoricData(cachedResponse || []);
            if (start && end) setLoadedRange({ start, end });
            else setLoadedRange(null);
            setHistoricDataLoading(false);
            return;
        }

        try {
            const params = {
                startDate: start ? start.toISOString().split('T')[0] : undefined, 
                endDate: end ? end.toISOString().split('T')[0] : undefined,    
            };
            const response = await dashboardGetters.getStationHistoric(Number(id), params);
            if (response.success && response.data) {
                const fetchedData = response.data || [];
                setHistoricData(fetchedData);
                setCachedData((prev) => new Map(prev).set(cacheKey, fetchedData));
                if (start && end) {
                    setLoadedRange({ start, end });
                } else {
                    setLoadedRange(null); 
                }
            } else {
                setHistoricDataError(response.error || "Falha ao carregar dados históricos");
                setHistoricData([]); 
            }
        } catch (err) {
            setHistoricDataError(err instanceof Error ? err.message : "Erro desconhecido ao buscar dados históricos");
            setHistoricData([]);
        } finally {
            setHistoricDataLoading(false);
        }
    }, [id, cachedData]);
    
    const calculateDatesFromRange = useCallback((
        rangeKey: PredefinedRangeKey, 
        customStartStr?: string, 
        customEndStr?: string
    ): { start?: Date, end?: Date } => {
        const today = new Date();
        let startDate: Date | undefined = new Date(today); 
        let endDate: Date | undefined = new Date(today);

        endDate.setHours(23, 59, 59, 999);

        switch (rangeKey) {
            case "7d":
                startDate.setDate(today.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
                break;
            case "30d":
                startDate.setDate(today.getDate() - 30);
                startDate.setHours(0, 0, 0, 0);
                break;
            case "3m":
                startDate.setMonth(today.getMonth() - 3);
                startDate.setHours(0, 0, 0, 0);
                break;
            case "6m":
                startDate.setMonth(today.getMonth() - 6);
                startDate.setHours(0, 0, 0, 0);
                break;
            case "1y":
                startDate.setFullYear(today.getFullYear() - 1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case "all":
                startDate = undefined;
                endDate = undefined;
                break;
            case "custom":
                if (customStartStr) {
                    startDate = new Date(customStartStr + "T00:00:00");
                } else {
                    startDate = undefined;
                }
                if (customEndStr) {
                    endDate = new Date(customEndStr + "T23:59:59"); 
                } else {
                    endDate = undefined;
                }
                break;
            default: 
                startDate.setDate(today.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
        }
        return { start: startDate, end: endDate };
    }, []);

    const handleApplyDateRange = useCallback(() => {
        if (!id) return;
        const { start, end } = calculateDatesFromRange(selectedRangeKey, customStartDate, customEndDate);
        
        if (selectedRangeKey === "custom" && (!start || !end)) {
            setHistoricDataError("Para um período customizado, ambas datas de início e fim devem ser selecionadas.");
            return;
        }
        fetchHistoricDataWithCaching(start, end);
    }, [id, selectedRangeKey, customStartDate, customEndDate, calculateDatesFromRange, fetchHistoricDataWithCaching]);
    
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
                fetchDashboard();
                setLoading(false);
            }
        };

        const fetchDashboard = async () => {
          try {
            const [
                alertCountsResponse,
                measureStatusResponse,
                lastMeasuresResponse
            ] = await Promise.all([
                dashboardGetters.getAlertCounts(Number(id)),
                dashboardGetters.getMeasuresStatus(Number(id)),
                dashboardGetters.getLastMeasures(Number(id))
            ]);

            setAlertCounts(alertCountsResponse.data ?? {R: 0, Y: 0 , G: 0});
            setLastMeasures(lastMeasuresResponse.data ?? []);
            
            if (lastMeasuresResponse.data) {
                lastMeasuresResponse.data.forEach((measure) => {
                    if (measure.type === "temp") {
                        const temperatureProps = getTemperatureProps(measure.measure_unit);
                        setTemperatureProps(temperatureProps);
                    }
                });
            };
                      
            const formattedData = measureStatusResponse.data?.map(item => ({
                name: item.name,  
                y: item.total  
            }));
            setMeasureStatus(formattedData ?? []);
            
            handleApplyDateRange();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido");
          }
        }

        if (id) {
            fetchStation();
        }
    }, [id]);

    function getTemperatureProps(unitFromMeasure: string): TemperatureProps {
      switch (unitFromMeasure?.toUpperCase()) {
        case '°C':
        case 'C':
        case 'CELSIUS':
          return { min: -30, max: 60, unit: '°C' };
        case '°F':
        case 'F':
        case 'FAHRENHEIT':
          return { min: -22, max: 140, unit: '°F' };
        case 'K':
        case 'KELVIN':
          return { min: 243, max: 333, unit: 'K' }; 
        default:
          return { min: -30, max: 60, unit: '°C' };
      }
    }

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
                     {lastMeasures.map((measure, index) => {
                      return (
                        <>
                        {measure.type === "temp" && temperatureProps && (
                          <Box sx={{ minWidth: 260, flex: 1 }}>
                            <ThermometerGraphic title="Temperatura" value={measure.value ?? 0} min={temperatureProps.min} max={temperatureProps.max} unit={temperatureProps.unit} measureDate={measure.measure_date.toString()}/>
                          </Box>
                        )}
                        {measure.type === "press" && (
                          <Box sx={{ minWidth: 260, flex: 1 }}>
                            <GaugeGraphic title="Pressão atmosférica" value={measure.value} min={950} max={1050} unit={measure.measure_unit} measureDate={measure.measure_date.toString()}/>
                          </Box>
                        )}
                        {measure.type === "umid" && (
                          <Box sx={{ minWidth: 260, flex: 1 }}>
                            <BucketGraphic title="Umidade do ar" value={measure.value} min={0} max={100} unit={measure.measure_unit} measureDate={measure.measure_date.toString()}/>
                          </Box>
                        )}
                        {measure.type === "velvent" && (
                          <Box sx={{ minWidth: 260, flex: 1 }}>
                            <VelocimeterGraphic title="Velocidade do vento" value={measure.value} min={0} max={100} unit={measure.measure_unit} measureDate={measure.measure_date.toString()}/>
                          </Box>
                        )}
                      </>
                      )}
                    )}
                    {measureStatus.length > 0 ? (
                      <Box sx={{ minWidth: 260, flex: 1 }}>
                        <PizzaGraphic title="Alertas" data={measureStatus} />
                      </Box>
                    ) : (
                      <Box sx={{ minWidth: 260, flex: 1 }}>
                        <Typography variant="h6" color="text.secondary" textAlign="center">
                          Nenhum alerta encontrado
                        </Typography>
                      </Box>
                    )}
                </Stack>

                <Divider sx={{ margin: '16px 0' }} />
                <Typography variant="h6" gutterBottom sx={{color: "rgb(146, 123, 230)", fontWeight:'bold'}}>
                    Escolha um período para visualizar o histórico
                </Typography>
                  <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems="center" mb={2}>
                    <FormControl sx={{ minWidth: 180, flexGrow: {sm: 1} }} size="small">
                        <InputLabel id="range-select-label">Períodos pré-determinados</InputLabel>
                        <Select
                            labelId="range-select-label"
                            value={selectedRangeKey}
                            label="Predefined Range"
                            onChange={(e) => setSelectedRangeKey(e.target.value as PredefinedRangeKey)}
                        >
                            {rangeOptions.map(option => (
                                <MenuItem key={option.key} value={option.key}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedRangeKey === "custom" && (
                        <>
                            <TextField
                                label="Data inicial"
                                type="date"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{flexGrow: {sm: 1}}}
                                size="small"
                            />
                            <TextField
                                label="Data final"
                                type="date"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{flexGrow: {sm: 1}}}
                                size="small"
                            />
                        </>
                    )}
                    <Button 
                        variant="contained" 
                        onClick={handleApplyDateRange} 
                        sx={{height: '40px', backgroundColor: "rgb(146, 123, 230)", '&:hover': {backgroundColor: "rgb(120, 100, 200)"}}}
                    >
                        Buscar dados
                    </Button>
                  </Stack>
                {/* {historicDataLoading && <Box textAlign="center" my={2}><CircularProgress /></Box>} */}
                {historicDataError && <Typography color="error" textAlign="center" my={2}>{historicDataError}</Typography>}
                <LineGraphic title="Histórico de medições" measure={historicData} isLoading={historicDataLoading}/>
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