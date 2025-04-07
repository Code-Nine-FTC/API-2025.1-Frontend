import api from "../globals";
import { RegisterStation } from "./state";

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
}