import { AlertTypeResponse, AlertTypeUpdate } from "@pages/EditAlertType";
import axios from "axios";

const api = axios.create({
  baseURL: `http://127.0.0.1:5000`,
});

const isUserLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const links = {
  login: async (email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, token_type } = response.data;

      if (!access_token || !token_type) {
        throw new Error("Resposta inválida do servidor: faltando access_token ou token_type");
      }

      const fullToken = `Bearer ${access_token}`;
      localStorage.setItem("token", fullToken);
      console.log("Token enviado:", fullToken);

      return { success: true, token: fullToken };
    } catch (error: any) {
      console.error("Erro ao autenticar:", error.message || error);
      return { success: false, error: "Erro ao autenticar" };
    }
  },

  createStation: async (station: {
    name: string;
    uid: string;
    latitude: number;
    longitude: number;
    address: {
      city: string;
      state: string;
      country: string;
    };
    parameter_types: Array<any>;
  }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.post(
        "/stations",
        {
          name: station.name,
          uid: station.uid,
          latitude: station.latitude,
          longitude: station.longitude,
          address: station.address,
          parameter_types: station.parameter_types,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Resposta do backend:", response);

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Erro ao criar estação:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao criar estação" };
    }
  },

  listStations: async (filters?: {
      uid?: string;
      name?: string;
      start_date?: string;
      end_date?: string;
      page?: number;
      limit?: number;
    }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const params = new URLSearchParams();
      console.log("filtros", filters)
      console.log(params)

      if (filters) {
        if (filters.uid) params.append("uid", filters.uid);
        if (filters.name) params.append("name", filters.name);
        if (filters.start_date) params.append("start_date", filters.start_date);
        if (filters.end_date) params.append("end_date", filters.end_date);
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());
      }

      const response = await api.get("/stations/stations", {
        headers: {
          Authorization: token,
        },
        params: params,
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || "Erro ao buscar alertas" };
    }
  },

  createAlert: async (alert: {
    name: string;
    uid: string;
    latitude: number;
    longitude: number;
    address: {
      city: string;
      state: string;
      country: string;
    };
    parameter_types: Array<any>;
  }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.post(
        "/alerts",
        {
          name: alert.name,
          uid: alert.uid,
          latitude: alert.latitude,
          longitude: alert.longitude,
          address: alert.address,
          parameter_types: alert.parameter_types,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Resposta do backend:", response);

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Erro ao criar alerta:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao criar alerta" };
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
      return { success: false, error: error.response?.data?.detail || "Erro ao criar o tipo de alerta" };
    }
  },

  getFilteredAlerts: async (filters?: {
    type_alert_name?: string;
    station_name?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data?: Array<{ id: number; measure_value: string; type_alert_name: string; station_name: string; create_date: string }>; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const params = new URLSearchParams();

      if (filters) {
        if (filters.type_alert_name) params.append("type_alert_name", filters.type_alert_name);
        if (filters.station_name) params.append("station_name", filters.station_name);
        if (filters.start_date) params.append("start_date", filters.start_date);
        if (filters.end_date) params.append("end_date", filters.end_date);
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());
      }

      const response = await api.get("/alert/all", {
        headers: {
          Authorization: token,
        },
        params: params.toString() ? params : undefined,
      });

      if (response.data && Array.isArray(response.data.data)) {
        const alerts = response.data.data.map((item: any) => ({
          id: item.id,
          measure_value: item.measure_value,
          type_alert_name: item.type_alert_name,
          station_name: item.station_name,
          create_date: item.create_date,
        }));
        return { success: true, data: alerts };
      }

      throw new Error("Resposta inválida do servidor");
    } catch (error: any) {
      console.error("Erro ao buscar alertas filtrados:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao buscar alertas filtrados" };
    }
  },

  getAlertById: async (alertId: number): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.get(`/alert/${alertId}`, {
        headers: {
          Authorization: token,
        },
      });

      console.log("Resposta do backend:", response);

      if (response.data) {
        return { success: true, data: response.data };
      }

      throw new Error("Resposta inválida do servidor");
    } catch (error: any) {
      console.error("Erro ao buscar alerta por ID:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao buscar alerta por ID" };
    }
  },

  deleteAlert: async (alertId: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      console.log("Token enviado:", token);

      const response = await api.delete(`/alert/${alertId}`, {
        headers: {
          Authorization: token,
        },
      });

      console.log("Resposta do backend:", response);

      if (response.status === 204) {
        return { success: true };
      }

      throw new Error("Erro ao deletar o alerta");
    } catch (error: any) {
      console.error("Erro ao deletar o alerta:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao deletar o alerta" };
    }
  },

  getFilteredStations: async (filters?: {
    uid?: string;
    name?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data?: Array<{ id: number; name_station: string }>; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const params = new URLSearchParams();

      if (filters) {
        if (filters.uid) params.append("uid", filters.uid);
        if (filters.name) params.append("name", filters.name);
        if (filters.start_date) params.append("start_date", filters.start_date);
        if (filters.end_date) params.append("end_date", filters.end_date);
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());
      }

      const response = await api.get("/stations/filters", {
        headers: {
          Authorization: token,
        },
        params: params,
      });

      console.log("Resposta do backend:", response);

      if (response.data && Array.isArray(response.data.data)) {
        const stations = response.data.data.map((station: any) => ({
          id: station.id,
          name_station: station.name_station,
        }));
        return { success: true, data: stations };
      }

      throw new Error("Resposta inválida do servidor");
    } catch (error: any) {
      console.error("Erro ao buscar estações filtradas:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao buscar estações filtradas" };
    }
  },

  listParameterTypes: async (filters?: {
    name?: string;
    measure_unit?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data?: Array<{ id: number; name: string; measure_unit: string; qnt_decimals: number; offset?: number; factor?: number }>; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const params = new URLSearchParams();

      if (filters) {
        if (filters.name) params.append("name", filters.name);
        if (filters.measure_unit) params.append("measure_unit", filters.measure_unit);
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());
      }

      const response = await api.get("/parameter_types", {
        headers: {
          Authorization: token,
        },
        params: params,
      });

      console.log("Resposta do backend:", response);

      if (response.data && Array.isArray(response.data.data)) {
        const parameterTypes = response.data.data.map((parameterType: any) => ({
          id: parameterType.id,
          name: parameterType.name,
          measure_unit: parameterType.measure_unit,
          qnt_decimals: parameterType.qnt_decimals,
          offset: parameterType.offset,
          factor: parameterType.factor,
        }));
        return { success: true, data: parameterTypes };
      }

      throw new Error("Resposta inválida do servidor");
    } catch (error: any) {
      console.error("Erro ao listar tipos de parâmetro:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao listar tipos de parâmetro" };
    }
  },

  getParametersByStation: async (parameterTypeId: number): Promise<{ success: boolean; data?: Array<{ id: number; name_station: string }>; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      // Faz a requisição ao endpoint com o ID do parâmetro na URL e na query string
      const response = await api.get(`/stations/parameters/${parameterTypeId}`, {
        headers: {
          Authorization: token,
        },
        params: {
          type_paramter_id: parameterTypeId, // Adiciona o parâmetro na query string
        },
      });

      console.log("Resposta do backend:", response);

      // Verifica se a resposta contém a propriedade `data` com um array
      if (response.data && Array.isArray(response.data.data)) {
        return { success: true, data: response.data.data };
      }

      throw new Error("Resposta inválida do servidor");
    } catch (error: any) {
      console.error("Erro ao buscar estações por parâmetro:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao buscar estações por parâmetro" };
    }
  },

  
  getAlertType: async (id: number): Promise<{ success: boolean; data?: AlertTypeResponse; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/alert_type/${id}`, {
        headers: { Authorization: token }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar tipo de alerta:", error);
      return { success: false, error: "Erro ao buscar tipo de alerta" };
    }
  },

  updateAlertType: async (id: number, data: AlertTypeUpdate): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(`/alert_type/${id}`, data, {
        headers: { Authorization: token }
      });
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar tipo de alerta:", error);
      return { success: false, error: "Erro ao atualizar tipo de alerta" };
    }
  },

  listAlertTypes: async (filters?: { [key: string]: string }): Promise<{ 
    success: boolean; 
    data?: Array<AlertTypeResponse>; 
    error?: string 
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
      return { success: false, error: error.response?.data?.detail || "Erro ao buscar alertas" };
    }
  },
  createParameterType: async (parameterType: {
    name: string;
    measure_unit: string;
    qnt_decimals: number;
    offset?: number;
    factor?: number;
  }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.post(
        "/parameter_types",
        {
          name: parameterType.name,
          measure_unit: parameterType.measure_unit,
          qnt_decimals: parameterType.qnt_decimals,
          offset: parameterType.offset,
          factor: parameterType.factor,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Resposta do backend:", response);

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Erro ao criar tipo de parâmetro:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao criar tipo de parâmetro" };
    }
  },
  updateParameterType: async (
    parameterTypeId: number,
    data: {
      name?: string;
      measure_unit?: string;
      qnt_decimals?: number;
      offset?: number;
      factor?: number;
      json?: Record<string, any>;
      is_active?: boolean;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.patch(
        `/parameter_types/${parameterTypeId}/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        return { success: true };
      }

      throw new Error("Erro ao atualizar o tipo de parâmetro");
    } catch (error: any) {
      console.error("Erro ao atualizar o tipo de parâmetro:", error.message || error);
      return {
        success: false,
        error: error.response?.data?.detail || "Erro ao atualizar o tipo de parâmetro",
      };
    }
  },
  
  getStation: async (stationId: number): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.get(`/stations/${stationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Erro ao obter estação:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao obter estação" };
    }
  },

  updateStation: async (
    stationId: number,
    data: {
      name?: string;
      uid?: string;
      latitude?: number;
      longitude?: number;
      address?: {
        city?: string;
        state?: string;
        country?: string;
      };
      is_active?: boolean;
      parameter_types?: Array<number>;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.patch(`/stations/${stationId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: true };
    } catch (error: any) {
      console.error("Erro ao atualizar estação:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao atualizar estação" };
    }
  },

  disableStation: async (stationId: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.patch(
        `/stations/${stationId}`,
        { is_active: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true };
    } catch (error: any) {
      console.error("Erro ao desativar estação:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao desativar estação" };
    }
  },

  activateStation: async (stationId: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.patch(
        `/stations/${stationId}`,
        { is_active: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true };
    } catch (error: any) {
      console.error("Erro ao ativar estação:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao ativar estação" };
    }
  },

  getUser: async (): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error("Erro ao buscar dados do usuário:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao buscar dados do usuário" };
    }
  },
};


export { links };
export default api;