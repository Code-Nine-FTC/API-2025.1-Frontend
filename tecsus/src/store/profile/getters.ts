import api from "../globals";
import { LoginResponse, Profile } from "./state";

export default {
  setToken: (token: string): void => {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = token;
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  login: async function (
    this: { setToken: (token: string) => void },
    email: string,
    password: string
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post<LoginResponse>("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, token_type } = response.data;
      if (!access_token || !token_type) {
        throw new Error("Resposta inválida do servidor: faltando access_token ou token_type");
      }

      const fullToken = `${token_type} ${access_token}`;
      this.setToken(fullToken);

      return { success: true, token: fullToken };
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        console.error("Erro ao autenticar:", err.response?.data || err.message || err);
        const errorMessage = err.response?.data?.message || "Erro ao autenticar";
        return { success: false, error: errorMessage };
      } else {
        console.error("Erro ao autenticar:", error);
        return { success: false, error: "Erro ao autenticar" };
      }
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  },

  userLogged(): boolean {
    const token = localStorage.getItem("token");
    return !!token;
  },

  async getProfile(): Promise<Profile> {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = token;
    }

    const res = await api.get<{ data: Profile }>("/user/");
    return res.data.data;
  }
};
