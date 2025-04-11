import api from "../globals";
import { ListStationsFilters, ListStationsResponse, RegisterStation } from "./state";

export default {
    async registerStation(station: RegisterStation): 
        Promise<{ success: boolean; data?: any ;error?: string }> {
        try {
            console.log("station", station)
            const result = await api.post("/stations", station, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            return { success: true, data: result.data };
        } catch (error: any) {
            console.error("Erro ao criar estação:", error.message || error);
            return {
                success: false,
                error: error.message || "Erro ao criar estação",
            };
        }
    },

    async listStations(filters?: ListStationsFilters): 
        Promise<{ success: boolean; data?: [ListStationsResponse]; error?: string}> {
        try {

            const params = new URLSearchParams();

            if (filters) {
                if (filters.uid) params.append("uid", filters.uid);
                if (filters.name) params.append("name", filters.name);
                if (filters.status !== undefined) params.append("status", String(filters.status));
            }

            const response = await api.get("/stations/filters", {
                params: filters
            });
            return { success: true, data: response.data.data };
        } catch (error: any) {
            console.error("Erro ao listar estações:", error.message || error);
            return {
                success: false,
                error: error.message || "Erro ao listar estações",
            };
        }
    },
    
    async getStation(id: number): 
        Promise<{success: boolean; data?: ListStationsResponse; error?: string}> {
        try {
            const response = await api.get(`/stations/${id}`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            console.error("Erro ao obter estação:", error.message || error);
            throw new Error(error.message || "Erro ao obter estação");
        }
     }
}