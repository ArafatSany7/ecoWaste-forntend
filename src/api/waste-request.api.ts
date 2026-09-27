import { apiClient } from "./client";

export interface WasteRequestPayload {
  title: string;
  description: string;
  wasteType: "PLASTIC" | "ORGANIC" | "E_WASTE" | "PAPER" | "METAL" | "OTHER";
  estimatedWeight?: string;
  address: string;
  contactNumber: string;
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
  
  getById: async (id: string) => {
    return apiClient.get(`/waste-requests/${id}`);
  },
  
  updateStatus: async (id: string, status: string) => {
    return apiClient.patch(`/waste-requests/${id}/status`, { status });
  }
};
