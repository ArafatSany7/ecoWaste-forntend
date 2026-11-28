import { apiClient } from "./client";

export type JobStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "ASSIGNED"
  | "SCHEDULED"
  | "EN_ROUTE"
  | "COLLECTOR_ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "COLLECTED";

export interface CollectorJob {
  id: string;
  status: JobStatus;
  address: string;
  weight: number | null;
  latitude: number | null;
  longitude: number | null;
  tripStartedAt: string | null;
  createdAt: string;
  category?: { name: string } | null;
  zone?: { name: string; city: string } | null;
  citizen?: { firstName: string; lastName: string; phone: string } | null;
  collectionSchedule?: { scheduledDate: string; timeWindow: string } | null;
}

export interface JobsResponse {
  data: CollectorJob[];
  meta?: { page: number; limit: number; total: number };
}

export interface LocationFix {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
}

export interface CompletePayload {
  actualWeight: number;
  notes?: string;
}

export const collectorApi = {
  getMyJobs: async (params?: Record<string, unknown>): Promise<JobsResponse> => {
    return apiClient.get("/collectors/me/jobs", { params });
  },

  updateAvailability: async (isAvailable: boolean) => {
    return apiClient.patch("/collectors/me/availability", { isAvailable });
  },

  departForPickup: async (id: string) => {
    return apiClient.patch(`/collectors/requests/${id}/depart`);
  },

  updateLocation: async (fix: LocationFix) => {
    return apiClient.patch("/collectors/me/location", fix);
  },

  arriveAtLocation: async (id: string) => {
    return apiClient.patch(`/collectors/requests/${id}/arrive`);
  },

  startCollection: async (id: string) => {
    return apiClient.patch(`/collectors/requests/${id}/start`);
  },

  completeCollection: async (id: string, payload: CompletePayload) => {
    return apiClient.post(`/collectors/requests/${id}/complete`, payload);
  },
};
