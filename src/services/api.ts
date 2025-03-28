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

      const { access_token } = response.data;

      if (!access_token) {
        throw new Error("Token de acesso não recebido");
      }

      localStorage.setItem("token", access_token);

      return { success: true, token: access_token };
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return { success: false, error: "O email ou senha estão incorretos" };
      }
      return { success: false, error: "Erro ao conectar ao servidor" };
    }
  },

  registerStation: async (station: { name: string; uid: string; latitude: number; longitude: number; address: string[] }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.post("/stations", station, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Erro ao registrar estação" };
    }
  },

  editStation: async (id: string, station: { name: string; uid: string; latitude: number; longitude: number; address: string[] }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.patch(`/stations/${id}`, station, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Erro ao editar estação" };
    }
  },

  disableStation: async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.patch(`/stations/disable/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Erro ao desativar estação" };
    }
  },

  deleteStation: async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.delete(`/stations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Erro ao deletar estação" };
    }
  },

  getStation: async (id: string) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("Usuário não autenticado");
      }
  
      const response = await api.get(`/stations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Erro ao buscar estação" };
    }
  },
};

export { links };
export default api;