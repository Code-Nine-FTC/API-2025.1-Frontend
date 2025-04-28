import { useState, useEffect } from "react";
import { LoggedLayout } from "../layout/layoutLogged";
import DefaultLayout from "../layout/layoutNotLogged";
import alertGetters from "../store/alerts/getters";
import { Alert } from "../store/alerts/state";
import AlertsTable from "./AlertsList";
import { useAuth } from "../components/authContext";

const AlertsPage = () => {
  const auth = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts(filters?: { typeAlertName: string; stationName: string; startDate: string }) {
      try {
        setLoading(true);
        const adaptedFilters = filters
          ? {
              type_alert_name: filters.typeAlertName,
              station_name: filters.stationName,
              start_date: filters.startDate,
            }
          : undefined;
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
  ) 
};

export default AlertsPage;