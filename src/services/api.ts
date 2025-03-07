import axios from "axios";

const api = axios.create({
  baseURL: "https://api.exemplo.com", // Mude para sua API
  timeout: 5000,
});

export default api;
