import api from "../globals";
import { ListStationsFilters, ListStationsResponse, RegisterStation, UpdateStation } from "./state";

export default {
    async registerStation(station: RegisterStation): 
        Promise<{ success: boolean; data?: RegisterStation; error?: string }> {
        try {
            console.log("station", station)
            const result = await api.post("/stations", station, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            return { success: true, data: result.data };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erro ao criar estação";
            console.error("Erro ao criar estação:", errorMessage);
            return {
                success: false,
                error: errorMessage,
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
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erro ao listar estações";
            console.error("Erro ao listar estações:", errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    },
    
    async getStation(id: number): 
        Promise<{success: boolean; data?: ListStationsResponse; error?: string}> {
        try {
            const response = await api.get(`/stations/${id}`);
            return { success: true, data: response.data.data };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erro ao obter estação";
            console.error("Erro ao obter estação:", errorMessage);
            throw new Error(errorMessage);
        }
     },

    async updateStation(id: number, station: UpdateStation):
        Promise<{success: boolean; data?: UpdateStation; error?: string}> {
        try {
            console.log("station", station)
            const response = await api.patch(`/stations/${id}`, station, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return { success: true, data: response.data };
        } catch (error: unknown) {
            let errorMessage = "Erro ao atualizar estação";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Erro ao atualizar estação:", errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    async deactivateStation(id: number):
        Promise<{success: boolean; data?: object; error?: string}> {
        try {
            const response = await api.patch(`/stations/disable/${id}`);
            console.log(response)
            return { success: true, data: response.data };
        } catch (error: unknown) {
            let errorMessage = "Erro ao desativar estação";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Erro ao desativar estação:", errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
}