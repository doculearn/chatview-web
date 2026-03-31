import { NextResponse } from "next/server";
import { callChatView } from "@/lib/chatview-server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const refresh = String((body as { refresh?: string }).refresh ?? "").trim();

    if (!refresh) {
      return NextResponse.json({ error: "refresh is required" }, { status: 400 });
    }

    const data = await callChatView<Record<string, unknown>>("/accounts/token/refresh/", "POST", {
      body: { refresh },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Token refresh failed" }, { status: 400 });
  }
}