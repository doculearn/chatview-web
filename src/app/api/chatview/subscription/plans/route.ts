import { NextResponse } from "next/server";
import { callChatView, getRequestToken } from "@/lib/chatview-server";

export async function GET(req: Request) {
  try {
    const token = getRequestToken(req);
    const data = await callChatView<Record<string, unknown>>("/app/subscription/plans/", "GET", { token: token ?? undefined });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch plans" }, { status: 400 });
  }
}
