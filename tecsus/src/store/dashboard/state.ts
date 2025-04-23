export interface StationStatusResponse {
    enabled: number;
    total: number;
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
    label: string;
    value: number;
}
