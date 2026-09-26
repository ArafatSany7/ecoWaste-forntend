import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://eco-waste-backend-nine.vercel.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // We can get the token from the zustand store (which hydrates from localStorage)
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  if (error.response?.status === 401) {
    // Automatically logout if unauthorized
    useAuthStore.getState().logout();
    // In a real app we might redirect to login here, but since this is an Axios layer, 
    // it's safer to just let the app handle the auth state change (isAuthenticated -> false)
  }
  return Promise.reject(error.response?.data || error);
});
