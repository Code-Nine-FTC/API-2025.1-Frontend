import api from "../globals";
import { AlertCountsResponse, LastMeasureResponse, MeasuresStatusResponse, StationHistoricResponse, StationStatusResponse } from "./state";

export default {
    async getStationStatus(): Promise<{ success: boolean; data?: StationStatusResponse; error?: string }> {
        try {
            const response = await api.get("/dashboard/station-status");
            return { success: true, data: response.data.data };
        } catch (error: any) {
            console.error("Erro ao obter status das estações:", error.message || error);
            return {
                success: false,
                error: error.message || "Erro ao obter status das estações",
            };
        }
    },

    async getStationHistoric(stationId: number, params?: { startDate?: string; endDate?: string }): Promise<{ success: boolean; data?: [StationHistoricResponse]; error?: string }> {
        try {
            const response = await api.get(`/dashboard/station-history/${stationId}`, { params });
            return { success: true, data: response.data.data };
        } catch (error: any) { 
            console.error("Erro ao obter histórico das estações", error.message || error);
            return {
                success: false,
                error: error.message || "Erro ao obter histórico das estações",
            };
        }
    },

    async getAlertCounts(): Promise<{ success: boolean; data?: AlertCountsResponse; error?: string }> {
        try {
            const response = await api.get("/dashboard/alert-counts");
            return { success: true, data: response.data.data };
        } catch (error: any) {
            console.error("Erro ao obter contagem de alertas:", error.message || error);
            return {
                success: false,
                error: error.message || "Erro ao obter contagem de alertas",
            };
        }
    },
    
    async getMeasuresStatus(): Promise<{ success: boolean; data?: MeasuresStatusResponse[]; error?: string }> {
        try {
            const response = await api.get("/dashboard/alert-types");
            return { success: true, data: response.data.data };
        } catch (error: any) {
            console.error("Erro ao obter status das medidas:", error.message || error);
            return {
                success: false,
                error: error.message || "Erro ao obter status das medidas",
            };
        }
    },

    async getLastMeasures(stationId: number): Promise<{ success: boolean; data?: LastMeasureResponse[]; error?: string }> {
        try {
            const response = await api.get(`/dashboard/last-measures/${stationId}`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            console.error("Erro ao obter últimas medidas:", error.message || error);
            return {
                success: false,
                error: error.message || "Erro ao obter últimas medidas",
            };
        }
    }
}