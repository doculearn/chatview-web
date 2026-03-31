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

export function getRequestToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim() || null;
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separatorIndex = part.indexOf("=");
        const name = separatorIndex >= 0 ? part.slice(0, separatorIndex) : part;
        const value = separatorIndex >= 0 ? part.slice(separatorIndex + 1) : "";
        return [name, decodeURIComponent(value)];
      }),
  );

  return cookies.chatview_access_token ?? null;
}
