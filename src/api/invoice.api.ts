import { apiClient } from "./client";

export const invoiceApi = {
  getMyInvoices: async () => {
    return apiClient.get("/invoices/my-invoices");
  }
};
