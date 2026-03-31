"use client";

import { performLogout } from "@/lib/logout";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

type JsonObject = Record<string, unknown>;

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

async function tryRefreshToken() {
  const state = useAuthCredentialsStore.getState();
  const refreshToken = state.refreshToken;

  if (!refreshToken) {
    return null;
  }

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
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = useAuthCredentialsStore.getState().getAccessToken();

  const requestWithToken: RequestInit = {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const firstResponse = await fetch(input, requestWithToken);
  if (firstResponse.status !== 401) {
    return firstResponse;
  }

  const refreshedToken = await tryRefreshToken();
  if (!refreshedToken) {
    performLogout();
    return firstResponse;
  }

  const retryRequest: RequestInit = {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${refreshedToken}`,
    },
  };

  return fetch(input, retryRequest);
}