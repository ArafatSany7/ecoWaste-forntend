"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

export function GoogleAuthProvider({ children }: { children: ReactNode }) {

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-google-client-id.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
