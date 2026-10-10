import { apiClient } from "./client";

export const zoneApi = {
  getAll: async () => {
    return apiClient.get("/zones");
  },
  getById: async (id: string) => {
    return apiClient.get(`/zones/${id}`);
  },
  create: async (data: Record<string, unknown>) => {
    return apiClient.post("/zones", data);
  },
  update: async (id: string, data: Record<string, unknown>) => {
    return apiClient.patch(`/zones/${id}`, data);
  },
  delete: async (id: string) => {
    return apiClient.delete(`/zones/${id}`);
  }
};
