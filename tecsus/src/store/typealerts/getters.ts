import api from "../globals"
import { AlertTypeResponse, AlertTypeUpdate } from "./state";

export default {
  getAlertType: async (
    id: number
  ): Promise<{ success: boolean; data?: AlertTypeResponse; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/alert_type/${id}`, {
        headers: { Authorization: token },
      });
  
      return { success: true, data: response.data.data };
    } catch (error: unknown) {
      console.error("Erro ao buscar tipo de alerta:", error);
      let errorMessage = "Erro ao buscar tipo de alerta";
      type ErrorWithResponse = {
        response?: {
          data?: {
            detail?: string;
          };
        };
        message?: string;
      };
      const err = error as ErrorWithResponse;
      if (typeof err === "object" && err !== null && "response" in err && typeof err.response === "object") {
        errorMessage = err.response?.data?.detail || err.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  updateAlertType: async (
    id: number,
    data: AlertTypeUpdate
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(`/alert_type/${id}`, data, {
        headers: { Authorization: token },
        validateStatus: (status) => status < 500,
      });
  
      if (response.status === 200) {
        return { success: true };
      }
  
      return {
        success: false,
        error: response.data?.detail || "Erro ao atualizar tipo de alerta",
      };
    } catch (error: unknown) {
      console.error("Erro ao atualizar tipo de alerta:", error);
      let errorMessage = "Erro ao atualizar tipo de alerta";
      type ErrorWithResponse = {
        response?: {
          data?: {
            detail?: string;
          };
        };
        message?: string;
      };
      const err = error as ErrorWithResponse;
      if (typeof err === "object" && err !== null && "response" in err && typeof err.response === "object") {
        errorMessage = err.response?.data?.detail || err.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  listAlertTypes: async (filters?: {
    [key: string]: string;
  }): Promise<{
    success: boolean;
    data?: Array<AlertTypeResponse>;
    error?: string;
  }> => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/alert_type", {
        headers: { Authorization: token },
        params: filters,
      });

      const alertTypes = Array.isArray(response.data.data)
        ? response.data.data.map((item: AlertTypeResponse) => ({
            id: item.id,
            parameter_id: item.parameter_id,
            name: item.name,
            value: item.value,
            math_signal: item.math_signal,
            status: item.status,
            is_active: item.is_active,
            create_date: item.create_date,
            last_update: item.last_update,
          }))
        : [];

      return { success: true, data: alertTypes };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao buscar alertas:", error.message);
        return {
          success: false,
          error: (error as unknown & { response?: { data?: { detail?: string } } }).response?.data?.detail || error.message || "Erro ao buscar alertas",
        };
      } else {
        console.error("Erro ao buscar alertas:", error);
        return {
          success: false,
          error: "Erro ao buscar alertas",
        };
      }
    }
  },
  
  createAlertType: async (alertTypeData: {
    parameter_id: number;
    name: string;
    value: number;
    math_signal: string;
    status: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.post("/alert_type", alertTypeData, {
        headers: {
          Authorization: token,
        },
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200) {
        return { success: true };
      }

      return {
        success: false,
        error: response.data?.detail || "Erro ao criar o tipo de alerta",
      };
    } catch (error: unknown) {
      console.error("Erro ao criar o tipo de alerta:", error);
      let errorMessage = "Erro ao criar o tipo de alerta";
      type ErrorWithResponse = {
        response?: {
          data?: {
            detail?: string;
          };
        };
        message?: string;
      };
      const err = error as ErrorWithResponse;
      if (typeof err === "object" && err !== null && "response" in err && typeof err.response === "object") {
        errorMessage = err.response?.data?.detail || err.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  getParametersByStation: async (
    parameterTypeId: number
  ): Promise<{
    success: boolean;
    data?: Array<{ id: number; name_parameter: string }>;
    error?: string;
  }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.get(
        `/stations/parameters/${parameterTypeId}`,
        {
          headers: {
            Authorization: token,
          },
          params: {
            type_paramter_id: parameterTypeId,
          },
        }
      );

      if (response.data && Array.isArray(response.data.data)) {
        return { success: true, data: response.data.data };
      }

      throw new Error("Resposta inválida do servidor");
    } catch (error: unknown) {
      console.error(
        "Erro ao buscar parâmetros da estação:",
        error instanceof Error ? error.message : error
      );
      type ErrorWithResponse = {
        response?: {
          data?: {
            detail?: string;
          };
        };
        message?: string;
      };
      const err = error as ErrorWithResponse;
      return {
        success: false,
        error:
          err.response?.data?.detail ||
          "Erro ao buscar parâmetros da estação",
      };
    }
  },
  deactivateAlertType: async (
    id: number
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(`/alert_type/disables/${id}`, null, {
        headers: { Authorization: token },
        validateStatus: (status) => status < 500,
      });
  
      if (response.status === 200) {
        return { success: true };
      }
  
      return {
        success: false,
        error: response.data?.detail || "Erro ao alterar status do tipo de alerta",
      };
    } catch (error: unknown) {
      console.error("Erro ao alterar status do tipo de alerta:", error);
      let errorMessage = "Erro ao alterar status do tipo de alerta";
      type ErrorWithResponse = {
        response?: {
          data?: {
            detail?: string;
          };
        };
        message?: string;
      };
      const err = error as ErrorWithResponse;
      if (typeof err === "object" && err !== null && "response" in err && typeof err.response === "object") {
        errorMessage = err.response?.data?.detail || err.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  },  
};