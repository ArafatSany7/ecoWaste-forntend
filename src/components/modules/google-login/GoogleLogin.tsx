"use client";

import { useState } from "react";
import { toast } from "sonner";
import { GoogleLogin as GoogleOAuthButton } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export default function GoogleLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.error("Google OAuth Failed: Token not found.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await authApi.googleLogin(idToken);
      if (res.success) {
        toast.success(res.message || "Logged in successfully!");
        login(res.data);
        router.push("/dashboard");
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Google authentication failed with the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google OAuth Failed: Something went wrong. Please try again.");
  };

  return (
    <div className="w-full flex justify-center opacity-90 hover:opacity-100 transition-opacity">

      <div className={isLoading ? "pointer-events-none opacity-50" : ""}>
        <GoogleOAuthButton
          theme="outline"
          shape="pill"
          text="continue_with"
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>
    </div>
  );
}
