export interface Profile {
  id: number;
  name: string;
  email: string;
  last_update: string;
}

  
  export interface LoginResponse {
    access_token: string;
    token_type: string;
  }