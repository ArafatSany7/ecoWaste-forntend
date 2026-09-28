import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthResponse } from "@/api/auth.api";

interface AuthState {
  user: AuthResponse["data"]["user"] | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (data: AuthResponse["data"]) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthResponse["data"]["user"]>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (data) =>
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    {
      name: "ecowaste-auth-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
