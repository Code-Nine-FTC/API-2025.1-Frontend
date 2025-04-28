import api from "../globals";
import { ListStationsFilters, ListStationsResponse, RegisterStation, UpdateStation } from "./state";

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
     },

    async updateStation(id: number, station: UpdateStation):
        Promise<{success: boolean; data?: any; error?: string}> {
        try {
            console.log("station", station)
            const response = await api.patch(`/stations/${id}`, station, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return { success: true, data: response.data };
        } catch (error: any) {
            console.error("Erro ao atualizar estação:", error.message || error);
            return {
                success: false,
                error: error.message || "Erro ao atualizar estação",
            };
        }
    },

    async deactivateStation(id: number):
        Promise<{success: boolean; data?: any; error?: string}> {
        try {
            const response = await api.patch(`/stations/disable/${id}`);
            console.log(response)
            return { success: true, data: response.data };
        } catch (error: any) {
            console.error("Erro ao desativar estação:", error.message || error);
            return {
                success: false,
                error: error.message || "Erro ao desativar estação",
            };
        }
    }
}