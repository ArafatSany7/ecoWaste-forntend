import { apiClient } from "./client";

export const feedbackApi = {
  getAll: async (params?: Record<string, unknown>) => {
    return apiClient.get(`/feedbacks`, { params });
  },
  
  create: async (data: any) => {
    return apiClient.post(`/feedbacks`, data);
  }
};
