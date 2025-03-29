import axios from "axios";

const api = axios.create({
  baseURL: `http://127.0.0.1:5000`,
});

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

      return { success: true, token: fullToken };
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        console.error("Erro de autenticação:", error.response.data);
        return { success: false, error: "O email ou senha estão incorretos" };
      }

      console.error("Erro ao conectar ao servidor:", error.message);
      return { success: false, error: "Erro ao conectar ao servidor" };
    }
  },

  createStation: async (form: {
    name: string;
    uid: string;
    latitude: string;
    longitude: string;
  }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.post(
        "/stations",
        {
          name: form.name,
          uid: form.uid,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar estação:", error);
      throw error;
    }
  },

  createAlertType: async (form: {
    name: string;
    value: number;
    math_signal: string;
    status: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.post(
        "/alert_type/",
        {
          name: form.name,
          value: form.value,
          math_signal: form.math_signal,
          status: form.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Erro ao criar tipo de alerta:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao criar tipo de alerta" };
    }
  },

  listParameterTypes: async (name?: string, measure_unit?: string): Promise<{ success: boolean; data?: Array<{ id: number; name: string; measure_unit: string }>; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const params: Record<string, string> = {};
      if (name) params.name = name;
      if (measure_unit) params.measure_unit = measure_unit;

      const response = await api.get("/parameter_types/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      if (response.data && Array.isArray(response.data)) {
        const parameterTypes = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          measure_unit: item.measure_unit,
        }));
        return { success: true, data: parameterTypes };
      }

      throw new Error("Resposta inválida do servidor");
    } catch (error: any) {
      console.error("Erro ao buscar tipos de parâmetros:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao buscar tipos de parâmetros" };
    }
  },


  getAllAlertTypes: async (): Promise<{ success: boolean; data?: Array<{ id: number; parameter_id: number; name: string; value: number; math_signal: string; status: string; is_active: boolean; create_date: number; last_update: string }>; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.get(`/alert_type/`, { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error("Erro ao buscar tipos de alerta:", error.message || error);
      return { success: false, error: error.response?.data?.detail || "Erro ao buscar tipos de alerta" };
    }
  },
};

export { links };
export default api;