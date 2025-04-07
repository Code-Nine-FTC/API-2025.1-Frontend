import api from "../globals";
import { listParameterTypesFilters, ListParameterTypesResponse } from "./state";

export default {
    async listParameterTypes(filters?: listParameterTypesFilters): 
        Promise<{ success: boolean; data?: [ListParameterTypesResponse]; error?: string }> {
        try {
            const params = new URLSearchParams();
  
            if (filters) {
                if (filters.name) params.append("name", filters.name);
                if (filters.measure_unit) params.append("measure_unit", filters.measure_unit);
                if (filters.page) params.append("page", filters.page.toString());
                if (filters.limit) params.append("limit", filters.limit.toString());
                if (filters.is_active !== undefined) params.append("is_active", String(filters.is_active));
            }
        
            const response = await api.get("/parameter_types", {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                params: params,
            });

            if (response.data && Array.isArray(response.data.data)) {
                const parameterTypes = response.data.data.map((parameterType: any) => ({
                  id: parameterType.id,
                  name: parameterType.name,
                  measure_unit: parameterType.measure_unit,
                  is_active: parameterType.is_active ?? true,
                  qnt_decimals: parameterType.qnt_decimals,
                  offset: parameterType.offset,
                  factor: parameterType.factor,
                }));
                return { success: true, data: parameterTypes };
              }
            return { success: true, data: response.data };
        } catch (error: any) {
            console.error("Erro ao listar tipos de parâmetros:", error.message || error);
            return {
                success: false,
                error: error.message || "Erro ao listar tipos de parâmetros",
            };
        }
    }
}