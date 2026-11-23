import { apiClient } from "./client";

/** Matches the backend's createWasteRequestSchema. */
export interface WasteRequestPayload {
  categoryId: string;
  zoneId: string;
  address: string;
  weight?: number;
  /** Pickup pin. Both or neither. */
  latitude?: number;
  longitude?: number;
}

export interface WasteRequestResponse {
  success: boolean;
  message: string;
  data: unknown;
}

export const wasteRequestApi = {
  create: async (data: WasteRequestPayload): Promise<WasteRequestResponse> => {
    return apiClient.post("/waste-requests", data);
  },
  
  getAll: async (params?: Record<string, unknown>) => {
    return apiClient.get("/waste-requests", { params });
  },

  getMyRequests: async (params?: Record<string, unknown>) => {
    return apiClient.get("/waste-requests/my-requests", { params });
  },
  
  getById: async (id: string) => {
    return apiClient.get(`/waste-requests/${id}`);
  },
  
  updateStatus: async (id: string, status: string) => {
    return apiClient.patch(`/waste-requests/${id}/status`, { status });
  }
};
