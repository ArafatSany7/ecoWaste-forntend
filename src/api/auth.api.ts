import { apiClient } from "./client";

// Types
export interface LoginCredentials {
  email: string;
  password?: string; // Optional if using Google Auth
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: "CITIZEN" | "COLLECTOR" | "ADMIN";
      name: string;
    };
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post("/auth/login", credentials);
  },
  
  register: async (userData: Record<string, unknown>): Promise<AuthResponse> => {
    return apiClient.post("/auth/register", userData);
  },
  
  // Future implementation for Google Auth
  googleLogin: async (token: string): Promise<AuthResponse> => {
    return apiClient.post("/auth/google", { token });
  }
};
