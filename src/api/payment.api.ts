import { apiClient } from "./client";

export const paymentApi = {
  initiatePayment: async (invoiceId: string) => {
    return apiClient.post(`/payments/initiate`, { invoiceId });
  },
  
  verifyPayment: async (paymentId: string) => {
    return apiClient.post(`/payments/verify`, { paymentId });
  }
};
