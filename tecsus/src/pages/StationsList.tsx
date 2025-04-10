import { useEffect, useState } from "react";
import { ListStationsFilters, ListStationsResponse } from "../store/station/state";
import stationGetters from "../store/station/getters";
import { LoggedLayout } from "../layout/layoutLogged";
import { Box, Button, Checkbox, FormControlLabel, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import GenericTable, { Column } from "../components/table";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function StationsListPage() {
    const [stations, setStations] = useState<ListStationsResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>("");
    const [uid, setUid] = useState<string>("");
    const [status, setStatus] = useState<boolean>(true);

    const navigate = useNavigate();

    const columns: Column<ListStationsResponse>[] = [
        { field: "uid", headerName: "UID" },
        { field: "name_station", headerName: "Nome" },
        { field: "address", headerName: "Endereço" },
        { field: "latitude", headerName: "Latitude" },
        { field: "longitude", headerName: "Longitude" },
        { field: "create_date", headerName: "Data de criação" },
    ]
    
    async function getListStations() {
        try {
            const filters: ListStationsFilters = {}
            if (name && name.trim() !== "") {
                filters.name = name;
              }
              
              if (uid && uid.trim() !== "") {
                filters.uid = uid;
              }
              
              if (status === true) {
                filters.status = status;
              }

            const hasFilters = filters && Object.keys(filters).length > 0;

            const response = await stationGetters.listStations(hasFilters ? filters : undefined);
            if (response.success) {
                setStations(response.data as ListStationsResponse[]);
                console.log("stations", response.data)
                console.log("stations state", stations)
            } else {
                setError("Erro ao listar estações.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
        }
    }

    useEffect(() => {
        getListStations();
    }
    , []);

    function handleSearch() {
        getListStations();
    }

    function handleReset() {
        setName("");
        setUid("");
    }

    return (
        <LoggedLayout>
            <Box margin={2}>
            <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" mb={2}>Filtros de Busca</Typography>
                    
                    <Grid container spacing={2} mb={2}>
                    <Box
                        sx={{ 
                            display: 'grid',
                            gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)'
                            },
                            gap: 2,
                            mb: 2
                        }}
                        >
                            <TextField
                                fullWidth
                                label="Nome da Estação"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                size="small"
                            />
                        </Box>
                        <Box 
                            sx={{ 
                                display: 'grid',
                                gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)'
                                },
                                gap: 2,
                                mb: 2
                            }}
                            >
                            <TextField
                                fullWidth
                                label="UID"
                                name="uid"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                                size="small"
                            />
                        </Box>
                        <Box 
                            sx={{ 
                                display: 'grid',
                                gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)'
                                },
                                gap: 2,
                                mb: 2
                            }}
                            >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={status}
                                        onChange={(e) => setStatus(e.target.checked)}
                                        name="status"
                                    />
                                }
                                label="Apenas Estações Ativas"
                            />
                        </Box>
                    </Grid>
                    
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button 
                            variant="outlined" 
                            onClick={handleReset}
                        >
                            Limpar
                        </Button>
                        <Button
                            variant="contained" 
                            startIcon={<Search />}
                            onClick={handleSearch}
                        >
                            Buscar
                        </Button>
                    </Stack>
                </Paper>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">Estações Meteorológicas</Typography>
                    
                        <Button 
                            variant="contained" 
                            color="success" 
                            onClick={() => navigate('/stations/register')}
                        >
                            Cadastrar
                        </Button>
                </Box>

                <GenericTable 
                    columns={columns} 
                    rows={stations} 
                    renderCell={(row, column) => {
                        if (column.field === 'address') {
                            const address = row.address;
                            if (address) {
                              return `${address.city || ''}, ${address.state || ''}, ${address.country || ''}`;
                            }
                            return '';
                          }
        
                        if (column.field === 'create_date') {
                          return new Date(row[column.field] as string).toLocaleDateString();
                        }                        
                        return String(row[column.field]);
                      }}
                />
            </Box>
        </LoggedLayout>
    );
}