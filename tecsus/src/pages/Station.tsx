import { useCallback, useEffect, useState } from "react";
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
import dashboardGetters from "../store/dashboard/getters";
import BucketGraphic from "../components/graphics/bucketGraphic";
import VelocimeterGraphic from "../components/graphics/velocimeterGraphic";
import PizzaGraphic from "../components/graphics/pizzaGraphic";
import LineGraphic from "../components/graphics/stationHistoric";
import { AlertCountsResponse, LastMeasureResponse, StationHistoricResponse } from "../store/dashboard/state";

// Helper function to generate random numbers in a range
function getRandomValue(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

interface Measure {
  measure_date: number; // Unix timestamp in seconds
  value: number;
  type: string;
  measure_unit: string;
  title: string;
}

interface TemperatureProps {
  min: number;
  max: number;
  unit: string;
}


const sampleLastMeasures: LastMeasureResponse[] = [
  {
    title: "Temperatura",
    type: "temp",
    value: 25.5,
    measure_unit: "°C",
    measure_date: Math.floor(Date.now() / 1000) - 300 
  },
  {
    title: "Umidade",
    type: "press",
    value: 1012,
    measure_unit: "hPa",
    measure_date: Math.floor(Date.now() / 1000) - 300
  },
  {
    title: "Pressão",
    type: "umid",
    value: 60,
    measure_unit: "%",
    measure_date: Math.floor(Date.now() / 1000) - 300
  },
  {
    title: "Velocidade do Vento",
    type: "velvent",
    value: 5.2,
    measure_unit: "m/s",
    measure_date: Math.floor(Date.now() / 1000) - 300
  }
];

function generateHistoricalData(): Measure[] {
  const historicalData: Measure[] = [];
  const measureTypes = [
    { title: 'Temperatura', type: 'temp', unit: '°C', minVal: -5, maxVal: 35, dailyCycle: true },
    { title: 'Umidade', type: 'umid', unit: '%', minVal: 30, maxVal: 90, dailyCycle: true, inverseDailyCycle: true },
    { title: 'Pressão', type: 'press', unit: 'hPa', minVal: 980, maxVal: 1030 },
    { title: 'Velocidade do Vento', type: 'velvent', unit: 'm/s', minVal: 0, maxVal: 25 },
    { title: 'Precipitação Acumulada', type: 'precip', unit: 'mm', minVal: 0, maxVal: 5, isSparse: true },
  ];

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1); // Data for one year

  let currentDate = new Date(startDate.getTime());
  const intervalMinutes = 15;

  while (currentDate <= endDate) {
    const timestampInSeconds = Math.floor(currentDate.getTime() / 1000);
    const hourOfDay = currentDate.getHours(); // For daily cycle simulation

    for (const mt of measureTypes) {
      let value;
      if (mt.isSparse) {
        // Make sparse data (like rainfall) mostly zero
        value = Math.random() < 0.05 ? getRandomValue(mt.minVal, mt.maxVal) : 0;
      } else {
        value = getRandomValue(mt.minVal, mt.maxVal);
      }

      // Simulate a simple daily cycle for temperature and humidity
      if (mt.dailyCycle) {
        const cycleFactor = Math.sin((hourOfDay / 24) * 2 * Math.PI - Math.PI / 2); // Peaks around midday
        const range = mt.maxVal - mt.minVal;
        const baseValue = mt.minVal + range / 2;
        let cycleEffect = (cycleFactor * range) / 3; // Modulate effect strength
        
        if (mt.type === 'Temperatura') {
            // Temperature higher during the day
            value = baseValue + cycleEffect + (Math.random() - 0.5) * (range / 5);
        } else if (mt.type === 'Umidade') {
            // Humidity generally lower during warmer parts of the day
             value = baseValue - cycleEffect + (Math.random() - 0.5) * (range / 5);
        }
        value = Math.max(mt.minVal, Math.min(mt.maxVal, value)); // Clamp within min/max
      }

      historicalData.push({
        measure_date: timestampInSeconds,
        value: parseFloat(value.toFixed(2)),
        type: mt.type,
        measure_unit: mt.unit,
        title: mt.title,
      });
    }
    currentDate.setMinutes(currentDate.getMinutes() + intervalMinutes);
  }

  return historicalData;
}

const historicData: Measure[] = generateHistoricalData()

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
    const [historicStartDate, setHistoricStartDate] = useState<Date | null>(null);
    const [historicEndDate, setHistoricEndDate] = useState<Date | null>(null);

    const fetchStationHistoricData = useCallback(async (start?: Date, end?: Date) => {
        if (!id) return;
        setHistoricDataLoading(true);
        setHistoricDataError(null);
        try {
            const params = {
                startDate: start ? start.toISOString().split('T')[0] : undefined, 
                endDate: end ? end.toISOString().split('T')[0] : undefined,    
            };
            const response = await dashboardGetters.getStationHistoric(Number(id), params);
            if (response.success && response.data) {
                setHistoricData(response.data);
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
    }, [id]);

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
                dashboardGetters.getAlertCounts(),
                dashboardGetters.getMeasuresStatus(),
                dashboardGetters.getLastMeasures()
            ]);

            setAlertCounts(alertCountsResponse.data ?? {R: 0, Y: 0 , G: 0});
            setLastMeasures(sampleLastMeasures ?? []);
            
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
        } catch (error) {
            setError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido");
          }
        }

        if (id) {
            fetchStation();
        }
    }, [id]);

    useEffect(() => {
        if (historicStartDate && historicEndDate && id) {
            fetchStationHistoricData(historicStartDate, historicEndDate);
        }
    }, [historicStartDate, historicEndDate, id, fetchStationHistoricData]);

    const handleSetExtremes = useCallback((event: Highcharts.AxisSetExtremesEventObject) => {
        if (event.min !== undefined && event.max !== undefined) {
            if (event.trigger === 'rangeSelectorButton' || event.trigger === 'rangeSelectorInput') {
                setHistoricStartDate(new Date(event.min));
                setHistoricEndDate(new Date(event.max));
            } else if (!event.trigger) { 
                 setHistoricStartDate(new Date(event.min));
                 setHistoricEndDate(new Date(event.max));
            }
        } else {
            setHistoricStartDate(null);
            setHistoricEndDate(null);
        }
    }, []);

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
                    <Box sx={{ minWidth: 260, flex: 1 }}>
                      <PizzaGraphic title="Alertas" data={measureStatus} />
                    </Box>
                </Stack>

                <Divider sx={{ margin: '16px 0' }} />
                {historicDataLoading && <Box textAlign="center" my={2}><CircularProgress /></Box>}
                {historicDataError && <Typography color="error" textAlign="center" my={2}>{historicDataError}</Typography>}
                {!historicDataLoading && !historicDataError && (
                  <LineGraphic title="Histórico de medições" measure={historicData} onRangeChange={handleSetExtremes}/>
                )}
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