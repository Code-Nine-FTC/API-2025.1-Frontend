import api from "../globals";
import { ListParameterTypesFilters, ParameterTypeCreate, ParameterTypesResponse, UpdatedParameterType } from "./state";

export default {
    async listParameterTypes(filters?: ListParameterTypesFilters): 
        Promise<{ success: boolean; data?: ParameterTypesResponse[]; error?: string }> {
        try {
            const params = new URLSearchParams();

            if (filters) {
                if (filters.name) params.append("name", filters.name);
                if (filters.is_active !== undefined) params.append("is_active", String(filters.is_active));
            }

            const response = await api.get("/parameter_types/", {
                params: params,
            });

            if (response.data && Array.isArray(response.data.data)) {
                const parameterTypes = response.data.data.map((parameterType: ParameterTypesResponse) => ({
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
            return { success: true, data: response.data.data || [] };
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : "Erro ao listar tipos de parâmetros";
            console.error("Erro ao listar tipos de parâmetros:", errMsg);
            return {
                success: false,
                error: errMsg,
            };
        }
    },
    async deleteParameterType(id: number): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await api.patch(`/parameter_types/${id}/`);
            if (response.status === 200) {
                return { success: true };
            } 
            return { success: false, error: "Erro ao deletar tipo de parâmetro" };
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : "Erro ao deletar tipo de parâmetro";
            console.error("Erro ao deletar tipo de parâmetro:", errMsg);
            return {
                success: false,
                error: errMsg,
            };
        }
    },
    async createParameterType(data: ParameterTypeCreate): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await api.post("/parameter_types/", data);
            if (response.status === 200) {
                return { success: true };
            } 
            return { success: false, error: "Erro ao criar tipo de parâmetro" };
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : "Erro ao criar tipo de parâmetro";
            console.error("Erro ao criar tipo de parâmetro:", errMsg);
            return {
                success: false,
                error: errMsg,
            };
        }
    },
    async getParameterType(id: number): Promise<{ data?: ParameterTypesResponse | null; success: boolean; error?: string}> {
        try {
            const response = await api.get(`/parameter_types/${id}`);
            if (response.status === 200) {
                return { success: true, data: response.data.data};
            }
            return {success: false, error: "Erro ao listar tipo de parâmetro"};
        }
        catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : "Erro ao listar tipo de parâmetro";
            console.error("Erro ao listar tipo de parâmetro", errMsg);
            return {
                success: false,
                error: errMsg,
            };
        }
    },
    async updateParameterType(id: number, typeParameter: UpdatedParameterType): Promise<{ success: boolean; error?: string}> {
        try {
            const response = await api.patch(`/parameter_types/${id}/update`, typeParameter, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                return { success: true };
            }
            return { success: false, error: "Erro ao atualizar tipo de parâmetro"};
        }
        catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : "Erro ao atualizar tipo de parâmetro";
            console.error("Erro ao atualizar tipo de parâmetro", errMsg);
            return {
                success: false,
                error: errMsg,
            }
        }
    }    
}