
export interface AlertTypeResponse {
    id: number;
    parameter_id: number;
    name: string;
    value: number;
    math_signal: string;
    status: string;
    is_active: boolean;
    create_date: number;
    last_update: string;
  }
  

  export interface AlertTypeUpdate {
    name?: string;
    value?: number;
    math_signal?: string;
    status?: string;
    is_active?: boolean;
  }
  
 
  export interface AlertTypeState {
    alertTypes: AlertTypeResponse[];
    loading: boolean;
    error?: string; 
  }
  
  export interface AlertTypeFormData {
    parameter_id: number;
    name: string;
    value: number;
    math_signal: string;
    status: string;
  }

  export interface AlertTypeUpdate {
    parameter_id?: number;
    name?: string;
    value?: number;
    math_signal?: string;
    status?: string;
    is_active?: boolean;
  }
  