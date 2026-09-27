import { apiClient } from "./client";

export interface InitiatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentUrl?: string;
  };
}

export const paymentApi = {
  initiatePayment: async (invoiceId: string): Promise<InitiatePaymentResponse> => {
    return apiClient.post(`/payments/initiate`, { invoiceId });
  },

  verifyPayment: async (paymentId: string) => {
    return apiClient.post(`/payments/verify`, { paymentId });
  }
};
