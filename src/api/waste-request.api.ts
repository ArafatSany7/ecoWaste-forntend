import { apiClient } from "./client";

export const wasteRequestApi = {
  create: async (data: Record<string, unknown>) => {
    return apiClient.post("/waste-requests", data);
  },
  
  getAll: async (params?: Record<string, unknown>) => {
    return apiClient.get("/waste-requests", { params });
  },
  
  getById: async (id: string) => {
    return apiClient.get(`/waste-requests/${id}`);
  },
  
  updateStatus: async (id: string, status: string) => {
    return apiClient.patch(`/waste-requests/${id}/status`, { status });
  }
};
