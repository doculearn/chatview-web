"use client";

import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

export function performLogout(redirectTo = "/login") {
  useAuthCredentialsStore.getState().clearCredentials();

  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem("chatview-auth-credentials-storage");
    } catch {}

    if (window.location.pathname !== redirectTo) {
      window.location.href = redirectTo;
    }
  }
}