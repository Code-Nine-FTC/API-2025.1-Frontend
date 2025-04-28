export interface RegisterStation {
    name: string;
    uid: string;
    latitude: number;
    longitude: number;
    address: {
        country: string;
        city: string;
        state: string;
    };
    parameter_types?: number[]
}

export interface ListStationsResponse {
    id: number;
    name_station: string;
    uid: string;
    address: {
        country: string;
        city: string;
        state: string;
    }
    latitude: number;
    longitude: number;
    create_date: string;
    is_active: boolean;
    parameters: [{
        parameter_id: number;
        name_parameter: string;
        parameter_type_id: number;
    }];
}

export interface ListStationsFilters {
    uid?: string;
    name?: string;
    is_active?: boolean;
}

export interface UpdateStation {
    name?: string;
    uid?: string;
    latitude?: number;
    longitude?: number;
    address?: {
        country?: string;
        city?: string;
        state?: string;
    };
    parameter_types?: number[];
}