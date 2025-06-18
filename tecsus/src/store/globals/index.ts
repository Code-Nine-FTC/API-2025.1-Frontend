import axios from "axios";

const REMOTE_URL = "http://34.238.9.87:8000";
const LOCAL_URL = "http://127.0.0.1:5000";

// ! função para verificar a disponibilidade do servidor 
const checkServerAvailability = async (url: string): Promise<boolean> => {
  try {
    await axios.get(`${url}/stations/filters`, { timeout: 5000 });
    console.log(`Servidor ${url} está disponível`);
    return true;
  } catch (error) {
    console.log(`Servidor ${url} não está disponível, erro:`, error);
    return false;
  }
};

const api = axios.create({
  baseURL: LOCAL_URL,
});

// ! verifica a disponibilidade do servidor remoto e define a URL base do axios
(async () => {
  try {
    const isRemoteAvailable = await checkServerAvailability(REMOTE_URL);
    if (isRemoteAvailable) {
      api.defaults.baseURL = REMOTE_URL;
      console.log("Usando servidor remoto:", REMOTE_URL);
    } else {
      console.log("Usando servidor local:", LOCAL_URL);
    }
  } catch (error) {
    console.error("Erro ao verificar disponibilidade do servidor:", error);
  }
})();

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;