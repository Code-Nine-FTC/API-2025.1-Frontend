// Interface para o contexto de autenticação (opcional, se necessário em outro lugar)
// export interface AuthContextType {
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<{ success: boolean; token?: string; error?: string }>;
//   logout: () => Promise<void>;
//   userLogged: () => boolean;
// }


export interface LoginResponse {
  access_token: string;
  token_type: string;
}
