import { NextResponse } from "next/server";
import { callChatView, ChatViewApiError, getRequestToken } from "@/lib/chatview-server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getRequestToken(req);
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const { id } = await params;
    const data = await callChatView<Record<string, unknown>>(`/support/tickets/${id}/`, "GET", { token });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ChatViewApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status || 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load ticket" },
      { status: 400 },
    );
  }
}
