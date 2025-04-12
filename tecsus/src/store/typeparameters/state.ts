export interface ParameterTypesResponse {
    id: number;
    name: string;
    json: Record<string, any>;
    measure_unit: string;
    is_active: boolean;
    qnt_decimals: number;
    offset?: number;
    factor?: number;
}

export interface ListParameterTypesFilters {
    name?: string;
    is_active?: boolean 
}