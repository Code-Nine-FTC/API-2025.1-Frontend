import api from "../globals";
import { AlertFilters, GetFilteredAlertsResponse, Alert } from "./state";

export default {
    async getFilteredAlerts(filters?: AlertFilters): 
        Promise<GetFilteredAlertsResponse> {
        try {
            const params = new URLSearchParams();

            if (filters) {
                if (filters.type_alert_name) params.append("type_alert_name", filters.type_alert_name);
                if (filters.station_name) params.append("station_name", filters.station_name);
                if (filters.start_date) params.append("start_date", filters.start_date);
            }

            const response = await api.get("/alert/all", {
                params: params.toString() ? params : undefined,
            });

            console.log("Dados brutos da API:", response.data); // Log dos dados brutos da API

            if (response.data && Array.isArray(response.data.data)) {
                const alerts: Alert[] = response.data.data.map((item: Alert) => ({
                    id: item.id,
                    measure_value: item.measure_value,
                    type_alert_name: item.type_alert_name,
                    station_name: item.station_name,
                    create_date: item.create_date,
                }));
                return { success: true, data: alerts };
            }

            throw new Error("Resposta inválida do servidor");
        } catch (error: unknown) {
            if (error instanceof Error) {
                const axiosError = error as { response?: { data?: { detail?: string } } };
                console.error("Erro ao buscar alertas filtrados:", error.message);
                return {
                    success: false,
                    error: axiosError.response?.data?.detail || error.message || "Erro ao buscar alertas filtrados",
                };
            } else {
                console.error("Erro desconhecido ao buscar alertas filtrados:", error);
                return {
                    success: false,
                    error: "Erro desconhecido ao buscar alertas filtrados",
                };
            }
        }
    },

    async getAlertById(id: number): 
        Promise<{ success: boolean; data?: Alert; error?: string }> {
        try {
            const response = await api.get(`/alert/${id}`);
            return { success: true, data: response.data };
         } catch (error: unknown) {
            if (error instanceof Error) {
                const axiosError = error as { response?: { data?: { detail?: string } } };
                console.error("Erro ao obter alerta:", error.message);
                return {
                    success: false,
                    error: axiosError.response?.data?.detail || error.message || "Erro ao obter alerta",
                };
            } else {
                console.error("Erro desconhecido ao obter alerta:", error);
                return {
                    success: false,
                    error: "Erro desconhecido ao obter alerta",
                };
            }
        }
    },

    async alertDisplayed(alertId: number): 
        Promise<{ success: boolean; error?: string }> {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Usuário não autenticado");
            }

            const response = await api.patch(`/alert/${alertId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            if (response.status === 204 || response.status === 200) {
                return { success: true };
            }

            throw new Error("Erro ao deletar o alerta");
        } catch (error: unknown) {
            if (error instanceof Error) {
                const axiosError = error as { response?: { data?: { detail?: string } } };
                console.error("Erro ao deletar o alerta:", error.message);
                return {
                    success: false,
                    error: axiosError.response?.data?.detail || error.message || "Erro ao deletar o alerta",
                };
            } else {
                console.error("Erro desconhecido ao deletar o alerta:", error);
                return {
                    success: false,
                    error: "Erro desconhecido ao deletar o alerta",
                };
            }
        }
    },
};