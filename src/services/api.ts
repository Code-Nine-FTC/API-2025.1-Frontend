import axios from "axios";

const api = axios.create({
  baseURL: `http://${import.meta.env.VITE_API_ROUTE}`,
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

      return { success: true, token: response.data.access_token };
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return { success: false, error: "O email ou senha estão incorretos" };
      }
      return { success: false, error: "Erro ao conectar ao servidor" };
    }
  },
};

export { links };
export default api;