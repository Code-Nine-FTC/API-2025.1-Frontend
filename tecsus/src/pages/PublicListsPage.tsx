import React, { useState } from "react";
import { Box, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import AlertsListPage from "./AlertsList"; 
import StationsListPage from "./StationsList"; 
import DefaultLayout from "../layout/layoutNotLogged";
import { useAuth } from "../components/authContext";
import { LoggedLayout } from "../layout/layoutLogged";

export default function PublicListsPage() {
  const [view, setView] = useState<"alerts" | "stations">("alerts");
  const auth = useAuth();

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: "alerts" | "stations") => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const content = (
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

      {view === "alerts" && <AlertsListPage alerts={[]} loading={false} onSearch={async () => Promise.resolve()} />}
      {view === "stations" && <StationsListPage onlyView={true} />}
    </Box>
  )

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