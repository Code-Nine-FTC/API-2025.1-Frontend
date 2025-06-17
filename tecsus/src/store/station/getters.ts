import api from "../globals";
import { ListStationsFilters, ListStationsResponse, RegisterStation, UpdateStation } from "./state";

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

export default {
    async registerStation(station: RegisterStation): 
        Promise<ApiResponse<unknown>> {
        try {
            console.log("station", station)
            const result = await api.post("/stations", station, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            return { success: true, data: result.data };
        } catch (error) {
            const err = error as { message?: string };
            console.error("Erro ao criar estação:", err.message || error);
            return {
                success: false,
                error: err.message || "Erro ao criar estação",
            };
        }
    },

    async listStations(filters?: ListStationsFilters): 
        Promise<ApiResponse<ListStationsResponse[]>> {
        try {
            const response = await api.get("/stations/filters", {
                params: filters
            });
            return { success: true, data: response.data.data };
        } catch (error) {
            const err = error as { message?: string };
            console.error("Erro ao listar estações:", err.message || error);
            return {
                success: false,
                error: err.message || "Erro ao listar estações",
            };
        }
    },
    
    async getStation(id: number): 
        Promise<ApiResponse<ListStationsResponse>> {
        try {
            const response = await api.get(`/stations/${id}`);
            return { success: true, data: response.data.data };
        } catch (error) {
            const err = error as { message?: string };
            console.error("Erro ao obter estação:", err.message || error);
            throw new Error(err.message || "Erro ao obter estação");
        }
     },

    async updateStation(id: number, station: UpdateStation):
        Promise<ApiResponse<unknown>> {
        try {
            console.log("station", station)
            const response = await api.patch(`/stations/${id}`, station, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            const err = error as { message?: string };
            console.error("Erro ao atualizar estação:", err.message || error);
            return {
                success: false,
                error: err.message || "Erro ao atualizar estação",
            };
        }
    },

    async deactivateStation(id: number):
        Promise<ApiResponse<unknown>> {
        try {
            const response = await api.patch(`/stations/disable/${id}`);
            console.log(response)
            return { success: true, data: response.data };
        } catch (error) {
            const err = error as { message?: string };
            console.error("Erro ao desativar estação:", err.message || error);
            return {
                success: false,
                error: err.message || "Erro ao desativar estação",
            };
        }
    }
}