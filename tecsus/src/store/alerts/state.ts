// Interface para os filtros de busca de alertas
export interface AlertFilters {
    type_alert_name?: string;
    station_name?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
}

// Interface para a resposta de um alerta
export interface Alert {
    id: number;
    measure_value: string;
    type_alert_name: string;
    station_name: string;
    create_date: string;
}

// Interface para o retorno da função getFilteredAlerts
export interface GetFilteredAlertsResponse {
    success: boolean;
    data?: Alert[];
    error?: string;
}