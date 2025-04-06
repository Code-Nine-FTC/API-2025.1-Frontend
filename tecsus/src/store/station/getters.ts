import api from "../globals";
import { RegisterStation } from "./state";

export default {
    async registerStation(station: RegisterStation): 
        Promise<{ success: boolean; data?: any ;error?: string }> {
        try {
            const result = await api.post("/station", station, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
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