import { apiClient } from "./client";

export interface ProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  defaultAddress?: string;
}

export const userApi = {
  getProfile: async () => {
    return apiClient.get(`/users/me`);
  },
  
  updateProfile: async (data: ProfileUpdatePayload) => {
    return apiClient.patch(`/users/me`, data);
  }
};
