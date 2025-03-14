import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

const links = {

//   loginAuthenticate: async (email: string, password: string) => {
//     try {
//       const response = await api.post("/auth/login", { email, password });
//       return response.data;
//     } catch (error: any) {

//       if (error.response) {
//         throw new Error(`Erro no login: ${error.response.data.message || "Falha ao fazer login"}`);
//       } else if (error.request) {

//         throw new Error("Erro ao fazer requisição: O servidor não respondeu.");
//       } else {

//         throw new Error(`Erro desconhecido: ${error.message}`);
//       }
//     }
//   },



};

export { links };
export default api;