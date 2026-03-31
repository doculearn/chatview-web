import { NextResponse } from "next/server";
import { callChatView } from "@/lib/chatview-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await callChatView<Record<string, unknown>>("/accounts/register/", "POST", { body });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 400 });
  }
}
