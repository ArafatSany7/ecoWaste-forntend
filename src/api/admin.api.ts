import { apiClient } from "./client";

export const adminApi = {
  getAllUsers: async () => {
    return apiClient.get(`/users`); 
  },
  
  updateUserRole: async (id: string, role: string) => {
    return apiClient.patch(`/users/${id}/role`, { role });
  },

  updateUserStatus: async (id: string, status: string) => {
    return apiClient.patch(`/users/${id}/status`, { status });
  }
};
