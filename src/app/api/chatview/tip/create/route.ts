import { NextResponse } from "next/server";
import { callChatView, ChatViewApiError, getRequestToken } from "@/lib/chatview-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = getRequestToken(req);
    const data = await callChatView<{ payment_link?: string; payment_id?: string }>(
      "/app/tip/create/",
      "POST",
      { token: token ?? undefined, body },
    );
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ChatViewApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status || 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create tip checkout" },
      { status: 400 },
    );
  }
}
