import { NextResponse } from "next/server";
import { callChatView, ChatViewApiError } from "@/lib/chatview-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await callChatView<Record<string, unknown>>(
      "/accounts/auth/oauth-session/",
      "POST",
      { body },
    );
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ChatViewApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status || 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve OAuth session" },
      { status: 400 },
    );
  }
}
