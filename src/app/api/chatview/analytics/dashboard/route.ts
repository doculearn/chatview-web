import { NextResponse } from "next/server";
import { callChatView, getRequestToken } from "@/lib/chatview-server";

/**
 * Proxy route for the in-house analytics dashboard.
 *
 * The Django endpoint at `/analytics/dashboard/` is gated by `IsAdminUser`,
 * so we forward the caller's JWT (added by `authFetch`) without modifying
 * it. Any auth failure surfaces as a 401/403 from the upstream and is
 * passed through here unchanged.
 */
export async function GET(req: Request) {
  try {
    const token = getRequestToken(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const site = url.searchParams.get("site") || "chat-view.xyz";
    const days = url.searchParams.get("days") || "7";
    const query = `?site=${encodeURIComponent(site)}&days=${encodeURIComponent(days)}`;

    const data = await callChatView<Record<string, unknown>>(
      `/analytics/dashboard/${query}`,
      "GET",
      { token },
    );

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load analytics" },
      { status: 400 },
    );
  }
}
