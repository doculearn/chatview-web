import { NextResponse } from "next/server";
import { callChatView } from "@/lib/chatview-server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const qrToken =
      typeof body?.qrToken === "string"
        ? body.qrToken
        : typeof body?.qr_token === "string"
          ? body.qr_token
          : null;

    if (!qrToken) {
      return NextResponse.json({ error: "Invalid QR token" }, { status: 400 });
    }

    // Call chatview-api to exchange QR token for auth tokens
    const data = await callChatView<Record<string, unknown>>("/qr/exchange/", "POST", {
      body: { qr_token: qrToken }
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to exchange QR token" }, { status: 400 });
  }
}
