import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const CHATVIEW_API_BASE_URL = (process.env.CHATVIEW_API_BASE_URL ?? "https://api.chat-view.xyz/api/v1").replace(/\/+$/, "");

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function callChatView<T>(path: string, method: Method, options?: { token?: string; body?: unknown }) {
  const routePath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${CHATVIEW_API_BASE_URL}${routePath}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CHATVIEW_API_KEY ? { "X-API-KEY": process.env.CHATVIEW_API_KEY } : {}),
      ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error || data?.detail || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function getSessionToken() {
  const session = await getServerSession(authOptions);
  const backendAccessToken = session?.backendAccessToken;
  const azureAccessToken = session?.azureAccessToken;
  return backendAccessToken || azureAccessToken || null;
}
