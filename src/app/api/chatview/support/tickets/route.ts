import { NextResponse } from "next/server";
import { callChatView, ChatViewApiError, getRequestToken } from "@/lib/chatview-server";

export async function GET(req: Request) {
  try {
    const token = getRequestToken(req);
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const data = await callChatView<Record<string, unknown>>("/support/tickets/", "GET", { token });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ChatViewApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status || 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load tickets" },
      { status: 400 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const token = getRequestToken(req);
    const body = await req.json();
    const data = await callChatView<Record<string, unknown>>(
      "/support/tickets/create/",
      "POST",
      { token: token ?? undefined, body },
    );
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof ChatViewApiError) {
      return NextResponse.json(
        { error: error.message, details: error.details ?? null },
        { status: error.status || 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create ticket" },
      { status: 400 },
    );
  }
}
