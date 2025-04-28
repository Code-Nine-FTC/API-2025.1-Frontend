export interface ParameterTypesResponse {
    id: number;
    name: string;
    detect_type: string;
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

export interface ParameterTypeCreate{
    name: string;
    detect_type: string;
    measure_unit: string;
    is_active: boolean;
    qnt_decimals: number;
    offset?: number;
    factor?: number;
}

export interface UpdatedParameterType{
	name?: string;
	detect_type?: string;
	measure_unit?: string;
	is_active?: boolean;
	qnt_decimals?: number;
	offset?: number;
	factor?: number;
}