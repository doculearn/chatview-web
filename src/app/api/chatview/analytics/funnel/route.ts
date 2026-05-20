import { NextResponse } from "next/server";
import { callChatView, getRequestToken } from "@/lib/chatview-server";

/**
 * Proxy for the conversion-funnel endpoint. Forwards the caller's JWT
 * to Django; upstream gates with IsAdminUser.
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
      `/analytics/funnel/${query}`,
      "GET",
      { token },
    );

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load funnel" },
      { status: 400 },
    );
  }
}
