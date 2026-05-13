import { NextResponse } from "next/server";
import { callChatView, ChatViewApiError, getRequestToken } from "@/lib/chatview-server";

export async function POST(req: Request) {
  try {
    const token = getRequestToken(req);
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const body = await req.json();
    const data = await callChatView<Record<string, unknown>>(
      "/marketplace/resolve/",
      "POST",
      { token, body },
    );
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ChatViewApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status || 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to resolve marketplace token" },
      { status: 400 },
    );
  }
}
