import { Box, Button, Typography } from "@mui/material";
import { ListStationsResponse } from "../../store/station/state";
import { useNavigate } from "react-router-dom";
import StationParametersBadge from "./stationParametersBadge";
import { useAuth } from "../authContext";

export default function StationHeader({station} : {station: ListStationsResponse | null}) {
    const navigate = useNavigate();
    const auth = useAuth(); 

    console.log("StationHeader", station);
    return station ? (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                gap: 2,
                padding: 2,
                backgroundColor: 'rgb(146, 123, 230)',
                borderRadius: 1,
                boxShadow: 1,
            }}
            flexDirection="row"
            paddingTop={{ xs: 6, sm: 6, md: 2, lg: 2 }}
        >
            <Box 
                sx={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    flexDirection:"column", 
                    color: "white", 
                    flexGrow: 2,
                }}
            >
                <Typography variant="h4" fontWeight={'bold'}>{station.name_station}</Typography>
                <Typography variant="h6">
                    UID: {station.uid}
                </Typography>
                <Typography variant="h6">
                    Endereço: {station.address.city}/{station.address.state} - {station.address.country}
                </Typography>
                {auth.isAuthenticated && (
                    <Button
                    variant="contained"
                    sx={{ 
                        mt: 1,
                        borderRadius: 5,
                        backgroundColor: "white", 
                        color: "rgb(146, 123, 230)", 
                        "&:hover": { backgroundColor: "#e0e0e0" } 
                    }}
                    onClick={() => {navigate(`/edit-station/${station.id}`)}}
                    >
                    Editar
                </Button>
                )}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flexGrow: 1,
                }}
            >
                <Box 
                    sx={{ 
                        display: "flex", 
                        alignItems: "flex-start",
                        flexDirection: "column",
                        color: "white", 
                        gap: 1,
                    }}
                    mr={{ xs: 0, sm: 0, md: 2, lg: 2 }}
                    >
                    <Box
                        sx={{
                            display: "flex", 
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 0.5,
                            width: "80%",
                            mb: 1,
                        }}
                    >
                        {station.parameters && station.parameters.length > 0 ? (
                            station.parameters.map(parameter => (
                                <StationParametersBadge 
                                    key={parameter.parameter_id || parameter.name_parameter}
                                    parameter={parameter.name_parameter} 
                                />
                            ))
                        ) 
                        : (
                            <Typography variant="h5">
                                Nenhum parâmetro cadastrado
                            </Typography>
                    )}
                    </Box>
                    <Typography variant="h6">
                        Data criação: {new Date(Number(station.create_date) * 1000).toLocaleDateString()}
                    </Typography>
                    <Box sx={{
                        display: "flex", 
                        alignItems: "center", 
                    }}>
                        <Typography variant="h6">
                            Status: {station.is_active ? "Ativa" : "Inativa"}
                        </Typography>
                        <Box sx={{
                            borderRadius: "50%", 
                            marginLeft: 1,
                            width: 16,
                            height: 16,
                            backgroundColor: station.is_active ? "#39ce3f" : "#F44336", 
                        }}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                Nenhuma estação encontrada
            </Typography>
        </Box>
    )
};