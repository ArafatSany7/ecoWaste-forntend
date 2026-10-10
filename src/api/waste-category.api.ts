import { apiClient } from "./client";

export const wasteCategoryApi = {
  getAll: async () => {
    return apiClient.get("/waste-categories");
  },
  getById: async (id: string) => {
    return apiClient.get(`/waste-categories/${id}`);
  },
  create: async (data: Record<string, unknown>) => {
    return apiClient.post("/waste-categories", data);
  },
  update: async (id: string, data: Record<string, unknown>) => {
    return apiClient.patch(`/waste-categories/${id}`, data);
  },
  delete: async (id: string) => {
    return apiClient.delete(`/waste-categories/${id}`);
  }
};
