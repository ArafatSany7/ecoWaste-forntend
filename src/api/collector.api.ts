import { apiClient } from "./client";

export const collectorApi = {
  getMyJobs: async (params?: Record<string, unknown>) => {
    return apiClient.get("/collectors/me/jobs", { params });
  },
  
  updateAvailability: async (status: string) => {
    return apiClient.patch("/collectors/me/availability", { status });
  },

  arriveAtLocation: async (id: string) => {
    return apiClient.post(`/collectors/requests/${id}/arrive`);
  },

  startCollection: async (id: string) => {
    return apiClient.post(`/collectors/requests/${id}/start`);
  },

  completeCollection: async (id: string) => {
    return apiClient.post(`/collectors/requests/${id}/complete`);
  }
};
