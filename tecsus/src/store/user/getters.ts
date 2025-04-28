/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../globals";
import { LoginResponse } from "./state";

export default {

    setToken: (token: string): void => {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = token;
    },

    getToken: (): string | null => {
      return localStorage.getItem("token");
    },

    login: async function (
      this: any,
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
      } catch (error: any) {
        console.error("Erro ao autenticar:", error.response?.data || error.message || error);
        const errorMessage = error.response?.data?.message || "Erro ao autenticar";
        return { success: false, error: errorMessage };
      }
    },
    
    logout: async (): Promise<void> => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
    },

    userLogged(): boolean {
        const token = localStorage.getItem("token");
        if (token) {
            // api.defaults.headers.common["Authorization"] = token;
            return true;
        }
        return false;
    }
};
