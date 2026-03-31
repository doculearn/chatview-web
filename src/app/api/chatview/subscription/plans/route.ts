import { NextResponse } from "next/server";
import { callChatView, getSessionToken } from "@/lib/chatview-server";

export async function GET() {
  try {
    const token = await getSessionToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await callChatView<Record<string, unknown>>("/app/subscription/plans/", "GET", { token });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch plans" }, { status: 400 });
  }
}
