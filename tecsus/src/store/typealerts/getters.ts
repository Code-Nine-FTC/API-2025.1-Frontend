import api from "../globals"
import { AlertTypeResponse, AlertTypeUpdate } from "./state";

export default {
getAlertType: async (id: number): Promise<{ success: boolean; data?: AlertTypeResponse; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/alert_type/${id}`, {
        headers: { Authorization: token },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar tipo de alerta:", error);
      return { success: false, error: "Erro ao buscar tipo de alerta" };
    }
  },

  updateAlertType: async (
    id: number,
    data: AlertTypeUpdate
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(`/alert_type/${id}`, data, {
        headers: { Authorization: token },
      });
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar tipo de alerta:", error);
      return { success: false, error: "Erro ao atualizar tipo de alerta" };
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

      console.log("Resposta da API (listAlertTypes):", response.data);

      const alertTypes = Array.isArray(response.data.data)
        ? response.data.data.map((item: any) => ({
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
    } catch (error: any) {
      console.error("Erro ao buscar alertas:", error.message || error);
      return {
        success: false,
        error: error.response?.data?.detail || "Erro ao buscar alertas",
      };
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

      const response = await api.post(
        "/alert_type",
        {
          parameter_id: alertTypeData.parameter_id,
          name: alertTypeData.name,
          value: alertTypeData.value,
          math_signal: alertTypeData.math_signal,
          status: alertTypeData.status,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 201) {
        return { success: true };
      }

      throw new Error("Erro ao criar o tipo de alerta");
    } catch (error: any) {
      console.error("Erro ao criar o tipo de alerta:", error.message || error);
      return {
        success: false,
        error: error.response?.data?.detail || "Erro ao criar o tipo de alerta",
      };
    }
  },
}
