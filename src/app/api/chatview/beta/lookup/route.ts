import { NextResponse } from "next/server";
import { callChatView } from "@/lib/chatview-server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }
  try {
    const data = await callChatView<Record<string, unknown>>(
      `/accounts/beta/lookup/?token=${encodeURIComponent(token)}`,
      "GET",
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lookup failed" },
      { status: 404 },
    );
  }
}
