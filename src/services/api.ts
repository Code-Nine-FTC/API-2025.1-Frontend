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

      const fullToken = `${token_type} ${access_token}`;
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
            Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
};

export { links };
export default api;