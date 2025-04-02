/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../globals";

export default {
    login: async (email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> => {
        try {
            const formData = new URLSearchParams();
            formData.append("email", email);
            formData.append("password", password);

            const response = await api.post("/auth/login", formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const { access_token, token_type } = response.data;
            const token = `${token_type} ${access_token}`;

            localStorage.setItem("token", token);
            api.defaults.headers.common["Authorization"] = token;

            return { success: true, token };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
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
            api.defaults.headers.common["Authorization"] = token;
            return true;
        }
        return false;
    }
};
