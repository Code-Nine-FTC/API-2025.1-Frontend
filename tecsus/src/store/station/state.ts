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
    parameter_types: number[];
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
    status: boolean;
    parameter_types: number[];
}

export interface ListStationsFilters {
    uid?: string;
    name?: string;
    status?: boolean;
}