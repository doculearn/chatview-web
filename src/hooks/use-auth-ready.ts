"use client";

import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

export function useAuthReady(): boolean {
  const accessToken = useAuthCredentialsStore((state) => state.accessToken);
  const hasHydrated = useAuthCredentialsStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return false;
  }

  if (accessToken) {
    return true;
  }

  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie.includes("chatview_access_token=");
}