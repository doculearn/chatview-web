import { NextResponse } from "next/server";
import { callChatView, getRequestToken } from "@/lib/chatview-server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getRequestToken(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await callChatView(`/accounts/pats/${encodeURIComponent(id)}/`, "DELETE", { token });
    return NextResponse.json({ message: "Token revoked" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to revoke token" },
      { status: 400 },
    );
  }
}
