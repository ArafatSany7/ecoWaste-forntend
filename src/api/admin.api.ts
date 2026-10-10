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
  },

  getDashboardAnalytics: async () => {
    return apiClient.get(`/analytics/admin-dashboard`);
  },

  getAuditLogs: async (params?: Record<string, unknown>) => {
    return apiClient.get(`/audit-logs`, { params });
  }
};
