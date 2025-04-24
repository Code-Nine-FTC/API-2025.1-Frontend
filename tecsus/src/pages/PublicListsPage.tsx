import React, { useState } from "react";
import { Box, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import AlertsListPage from "./AlertsList"; 
import StationsListPage from "./StationsList"; 
import DefaultLayout from "../layout/layoutNotLogged";

export default function PublicListsPage() {
  const [view, setView] = useState<"alerts" | "stations">("alerts");

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: "alerts" | "stations") => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <DefaultLayout>
    <Box display="flex" flexDirection="column" alignItems="center" p={3}>
      <Typography variant="h4" gutterBottom>
        Visualizar Listas
      </Typography>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        sx={{ mb: 3 }}
      >
        <ToggleButton value="alerts">Alertas</ToggleButton>
        <ToggleButton value="stations">Estações</ToggleButton>
      </ToggleButtonGroup>

      {view === "alerts" && <AlertsListPage alerts={[]} loading={false} onSearch={async () => Promise.resolve()} onDelete={async () => Promise.resolve()} />}
      {view === "stations" && <StationsListPage />}
    </Box>
    </DefaultLayout>
  );
}