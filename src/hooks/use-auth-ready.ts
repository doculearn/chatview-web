"use client";

import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

/**
 * Tri-state auth. "loading" covers store hydration only — a signed-out user is
 * "anonymous", not still loading, which is what left /support/tickets showing
 * "Loading…" forever.
 */
export function useAuthStatus(): AuthStatus {
  const accessToken = useAuthCredentialsStore((state) => state.accessToken);
  const hasHydrated = useAuthCredentialsStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return "loading";
  }

  if (accessToken) {
    return "authenticated";
  }

  // No cookies during SSR, so let the client decide rather than flashing signed-out.
  if (typeof document === "undefined") {
    return "loading";
  }

  return document.cookie.includes("chatview_access_token=")
    ? "authenticated"
    : "anonymous";
}

export function useAuthReady(): boolean {
  return useAuthStatus() === "authenticated";
}