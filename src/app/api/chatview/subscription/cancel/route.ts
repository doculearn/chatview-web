import { NextResponse } from "next/server";
import { callChatView, getRequestToken } from "@/lib/chatview-server";

export async function POST(req: Request) {
  try {
    const token = getRequestToken(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    
    const data = await callChatView<Record<string, unknown>>("/app/subscription/cancel/", "POST", {
      token,
      body,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to cancel subscription" }, { status: 400 });
  }
}
