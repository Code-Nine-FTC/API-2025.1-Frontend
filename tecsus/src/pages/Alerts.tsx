import { useState, useEffect } from "react";
import { LoggedLayout } from "../layout/layoutLogged";
import alertGetters from "../store/alerts/getters";
import { Alert } from "../store/alerts/state";
import AlertsTable from "./AlertsList";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts(filters?: { 
    typeAlertName: string; 
    stationName: string; 
    startDate: string;
  }) {
    try {
      setLoading(true);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let adaptedFilters: Record<string, any> | undefined;
      
      if (filters) {
        adaptedFilters = {};
        
        if (filters.typeAlertName) {
          adaptedFilters.type_alert_name = filters.typeAlertName;
        }
        
        if (filters.stationName) {
          adaptedFilters.station_name = filters.stationName;
        }
        
        if (Object.keys(adaptedFilters).length === 0) {
          adaptedFilters = undefined;
        }
      }
      
      const response = await alertGetters.getFilteredAlerts(adaptedFilters);
      if (response.success && response.data) {
        setAlerts(response.data);
      }
    } catch (err) {
      console.error("Erro ao buscar alertas:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoggedLayout>
      <AlertsTable alerts={alerts} loading={loading} onSearch={fetchAlerts} />
    </LoggedLayout>
  );
};

export default AlertsPage;