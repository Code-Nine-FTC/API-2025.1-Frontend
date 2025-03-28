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
};

export { links };
export default api;