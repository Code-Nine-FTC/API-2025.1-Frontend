import axios from "axios";

const api = axios.create({
  baseURL: `http://${import.meta.env.VITE_API_ROUTE}`,
});

const links = {
 fakeLogin: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  const fakeUser = {
    email: "admin@email.com",
    password: "123456",
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === fakeUser.email && password === fakeUser.password) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: "O email ou senha estão incorretos" });
      }
    });
  });
}



};

export { links };
export default api;