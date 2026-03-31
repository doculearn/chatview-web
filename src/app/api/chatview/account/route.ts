import { NextResponse } from "next/server";
import { callChatView, getRequestToken } from "@/lib/chatview-server";

export async function GET(req: Request) {
  try {
    const token = getRequestToken(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await callChatView<Record<string, unknown>>("/accounts/me/", "GET", { token });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch account" }, { status: 400 });
  }
}
