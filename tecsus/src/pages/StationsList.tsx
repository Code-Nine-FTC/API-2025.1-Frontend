import { useEffect, useState } from "react";
import { ListStationsFilters, ListStationsResponse } from "../store/station/state";
import stationGetters from "../store/station/getters";
import { LoggedLayout } from "../layout/layoutLogged";
import { Box, Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from "@mui/material";
import GenericTable, { Column } from "../components/table";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";

export default function StationsListPage() {
    const [stations, setStations] = useState<ListStationsResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>("");
    const [uid, setUid] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(true);

    const navigate = useNavigate();
    const auth = useAuth();

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
              
              if (isActive === true) {
                filters.is_active = isActive;
              }

            const hasFilters = filters && Object.keys(filters).length > 0;

            const response = await stationGetters.listStations(hasFilters ? filters : undefined);
            if (response.success) {
                setStations(response.data as ListStationsResponse[]);
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
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        gap: 2,
                        mb: 2
                    }}
                    >
                        <TextField
                            label="Nome da Estação"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            size="small"
                            sx={{ flexGrow: 1 }}
                        />
                        <TextField
                            label="UID"
                            name="uid"
                            value={uid}
                            onChange={(e) => setUid(e.target.value)}
                            size="small"
                            sx={{ flexGrow: 1 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    name="status"
                                />
                            }
                            label="Apenas Estações Ativas"
                            sx={{ 
                                minWidth: { xs: '100%', sm: 'auto' },
                                ml: { xs: 0, sm: 1 }
                            }}
                        />

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button 
                            variant="outlined" 
                            onClick={handleReset}
                        >
                            Limpar
                        </Button>
                        <Button
                            variant="contained" 
                            color="primary"
                            startIcon={<Search />}
                            onClick={handleSearch}
                        >
                            Buscar
                        </Button>
                    </Stack>
                </Box>
            </Paper>    
                <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    mb={2} 
                    sx={{
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                    }}>
                    <Typography variant="h5">Estações Meteorológicas</Typography>
                    
                    {auth.isAuthenticated && (
                        <Button 
                        variant="contained" 
                        color="success" 
                        onClick={() => navigate('/register-station')}
                    >
                        Cadastrar
                    </Button>
                    )}
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
                    renderActions={(row) => (
                        <Button
                            variant="outlined"
                            onClick={() => navigate(`/view-station/${row.id}`)}
                        >
                            Visualizar
                        </Button>
                    )
                    }
                />
            </Box>
        </LoggedLayout>
    );
}