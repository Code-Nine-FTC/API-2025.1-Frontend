import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { links } from "../services/api";
import { Modal, Box, Typography, CircularProgress, Button, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@components/layout/layoutNotLogged";
import StationTable from "@components/StationsTable";
import ReusableModal from "@components/ReusableModal";
import moment from "moment";

interface Alert {
    id: number;
    measureValue: string;
    typeAlertName: string;
    station: string;
    startDate: string;
    endDate: string;
}

const CombinedList: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [typeAlertName, setTypeAlertName] = useState("");
    const [stationName, setStationName] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const navigate = useNavigate();

    const fetchAlerts = async (filters?: { [key: string]: string }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await links.getFilteredAlerts(filters || {});
            if (response.success) {
                const alertsData =
                    response.data?.map((item: any) => ({
                        id: item.id,
                        measureValue: item.measure_value,
                        typeAlertName: item.type_alert_name,
                        station: item.station_name,
                        startDate: moment(item.create_date).format("DD/MM/YYYY HH:mm"),
                        endDate: moment(item.create_date).format("DD/MM/YYYY HH:mm"),
                    })) || [];
                setAlerts(alertsData);
                setFilteredAlerts(alertsData);
            } else {
                setError(response.error || "Erro ao carregar os alertas.");
            }
        } catch (err) {
            setError("Erro ao carregar os alertas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleSearch = () => {
        const filters: { [key: string]: string } = {};
        if (typeAlertName.trim()) filters.type_alert_name = typeAlertName;
        if (stationName.trim()) filters.station_name = stationName;

        fetchAlerts(filters);
    };

    const handleOpenModal = (alert: Alert) => {
        setSelectedAlert(alert);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedAlert(null);
        setModalOpen(false);
    };

    const columns = [
        { label: "ID", key: "id" as keyof Alert },
        { label: "Estação", key: "station" as keyof Alert },
        { label: "Valor da Medida", key: "measureValue" as keyof Alert },
        { label: "Tipo de Alerta", key: "typeAlertName" as keyof Alert },
        { label: "Data Inicial", key: "startDate" as keyof Alert },
        { label: "Data Final", key: "endDate" as keyof Alert },
    ];

    return (
        <DefaultLayout>
            <Box className="alerts-container">
                <h1 className="alerts-title">Estações</h1>
                <StationTable />
            </Box>
            <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                <Typography
                    variant="h4"
                    sx={{
                        marginBottom: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#5f5cd9",
                    }}
                >
                    Alertas
                </Typography>
                {/* Campos de busca */}
                <Box
                    sx={{
                        gap: "16px",
                        marginBottom: "20px",
                        padding: "16px",
                    }}
                >
                    <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <TextField
                            label="Filtrar por Tipo de Alerta"
                            variant="outlined"
                            value={typeAlertName}
                            onChange={(e) => setTypeAlertName(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Filtrar por Estação"
                            variant="outlined"
                            value={stationName}
                            onChange={(e) => setStationName(e.target.value)}
                            fullWidth
                        />
                    </Box>
                </Box>

                {/* Botões fora da caixa branca */}
                <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        startIcon={<SearchIcon />}
                        sx={{ backgroundColor: "#5f5cd9", color: "white", height: "56px" }}
                    >
                        Buscar
                    </Button>
                </Box>

                <DataTable<Alert>
                    data={filteredAlerts}
                    columns={columns}
                    loading={loading}
                    error={error}
                    renderActions={(row) => (
                        <Box sx={{ display: "flex", gap: "10px" }}>
                            <Button
                                variant="text"
                                onClick={() => handleOpenModal(row)}
                                sx={{ color: "#5f5cd9" }}
                            >
                                <SearchIcon />
                            </Button>
                        </Box>
                    )}
                />
                <ReusableModal
          open={modalOpen}
          onClose={handleCloseModal}
          title="Detalhes do Alerta"
        >
          {selectedAlert ? (
            <div>
              <Typography><strong>ID:</strong> {selectedAlert.id}</Typography>
              <Typography><strong>Tipo de Alerta:</strong> {selectedAlert.typeAlertName}</Typography>
              <Typography><strong>Estação:</strong> {selectedAlert.station}</Typography>
              <Typography><strong>Valor da Medida:</strong> {selectedAlert.measureValue}</Typography>
              <Typography><strong>Data Inicial:</strong> {selectedAlert.startDate}</Typography>
              <Typography><strong>Data Final:</strong> {selectedAlert.endDate}</Typography>
            </div>
          ) : (
            <Typography>Carregando...</Typography>
          )}
        </ReusableModal>
            </Box>
        </DefaultLayout>
    );
};

export default CombinedList;