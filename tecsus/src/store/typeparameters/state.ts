export interface ListParameterTypesResponse {
    id: number;
    name: string;
    measure_unit: string;
    is_active: boolean;
    qnt_decimals: number;
    offset?: number;
    factor?: number;
}

export interface ListParameterTypesFilters {
    name?: string;
    measure_unit?: string;
    is_active?: boolean | string; 
}