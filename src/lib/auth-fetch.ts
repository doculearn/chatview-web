"use client";

import { performLogout } from "@/lib/logout";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

type JsonObject = Record<string, unknown>;

// Track whether a token refresh is already in progress to avoid concurrent refreshes
let isRefreshing = false;
// Queue of requests waiting for the refresh to complete
let refreshSubscribers: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
}

function onRefreshFailed(error: unknown) {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
}

function extractTokens(data: JsonObject | null) {
  const accessToken =
    (typeof data?.access === "string" ? data.access : null) ??
    (typeof data?.access_token === "string" ? data.access_token : null) ??
    (typeof (data?.tokens as JsonObject | undefined)?.access_token === "string"
      ? ((data?.tokens as JsonObject).access_token as string)
      : null);

  const refreshToken =
    (typeof data?.refresh === "string" ? data.refresh : null) ??
    (typeof data?.refresh_token === "string" ? data.refresh_token : null) ??
    (typeof (data?.tokens as JsonObject | undefined)?.refresh_token === "string"
      ? ((data?.tokens as JsonObject).refresh_token as string)
      : null);

  return { accessToken, refreshToken };
}

async function tryRefreshToken(): Promise<string | null> {
  const state = useAuthCredentialsStore.getState();
  const refreshToken = state.refreshToken;

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch("/api/chatview/token/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = (await response.json().catch(() => null)) as JsonObject | null;

    if (!response.ok || !data) {
      return null;
    }

    const tokens = extractTokens(data);
    if (!tokens.accessToken) {
      return null;
    }

    state.setCredentials({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? refreshToken,
    });

    return tokens.accessToken;
  } catch {
    return null;
  }
}

/** Routes that should never trigger auto-logout on 401 */
function isAuthRoute(url: string): boolean {
  const authPaths = ["/api/chatview/login", "/api/chatview/register", "/api/chatview/token/refresh"];
  return authPaths.some((path) => url.includes(path));
}

/** Routes that can be called without auth (don't logout on 401) */
function isPublicRoute(url: string): boolean {
  return url.includes("/api/chatview/subscription/plans");
}

function buildRequest(init: RequestInit, token: string | null): RequestInit {
  return {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

/**
 * Authenticated fetch with automatic token refresh and logout on session expiry.
 *
 * - On 401, attempts a single silent token refresh.
 * - If another call is already refreshing, queues this request to retry once the
 *   refresh completes (avoids concurrent refresh requests).
 * - If the refresh fails, clears credentials and redirects to /login?session=expired.
 * - Auth-related routes (login, register, refresh) never trigger auto-logout.
 */
export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const token = useAuthCredentialsStore.getState().getAccessToken();

  const firstResponse = await fetch(input, buildRequest(init, token));

  // Not a 401 — return as-is
  if (firstResponse.status !== 401) {
    return firstResponse;
  }

  // 401 on auth/public routes — don't try to refresh, just return
  if (isAuthRoute(url) || isPublicRoute(url)) {
    return firstResponse;
  }

  // If a refresh is already in progress, wait for it instead of starting another
  if (isRefreshing) {
    try {
      const newToken = await new Promise<string>((resolve, reject) => {
        refreshSubscribers.push({ resolve, reject });
      });
      return fetch(input, buildRequest(init, newToken));
    } catch {
      // Refresh failed — logout already triggered by the original refresh caller
      return firstResponse;
    }
  }

  // Start the refresh
  isRefreshing = true;

  const refreshedToken = await tryRefreshToken();

  if (!refreshedToken) {
    isRefreshing = false;
    onRefreshFailed(new Error("Token refresh failed"));
    performLogout("/login?session=expired");
    return firstResponse;
  }

  isRefreshing = false;
  onRefreshed(refreshedToken);

  // Retry the original request with the new token
  return fetch(input, buildRequest(init, refreshedToken));
}