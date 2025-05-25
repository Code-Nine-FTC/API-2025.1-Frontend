export interface StationStatusResponse {
    total: number;
    active: number;
}

export interface StationHistoricResponse {
    title: string;
    type: string;
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

export interface LastMeasureResponse {
    title: string;
    type: string;
    value: number;
    measure_unit: string;
    measure_date: number;
}
