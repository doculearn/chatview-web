import { NextResponse } from "next/server";
import { callChatView, ChatViewApiError, getRequestToken } from "@/lib/chatview-server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getRequestToken(req);
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const data = await callChatView<Record<string, unknown>>(
      `/support/tickets/${id}/reply/`,
      "POST",
      { token, body },
    );
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof ChatViewApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status || 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to post reply" },
      { status: 400 },
    );
  }
}
