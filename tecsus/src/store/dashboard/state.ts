export interface StationStatusResponse {
    total: number;
    active: number;
}

export interface StationHistoricResponse {
    name: string;
    value: number;
    measure_unit: string;
    measure_date: number;
}

export interface AlertCountsResponse {
    R: number;
    Y: number;
    G: number;
}

export interface MeasuresStatusResponse {
    name: string;
    total: number;
}
