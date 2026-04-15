import { NextResponse } from "next/server";
import { callChatView, getRequestToken } from "@/lib/chatview-server";

const VALID_DATA_TYPES = ["usage_history", "session_data", "analytics", "support_messages"] as const;
type DataType = (typeof VALID_DATA_TYPES)[number];

export async function POST(req: Request) {
  try {
    const token = getRequestToken(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const dataTypes: unknown = body?.data_types;

    if (!Array.isArray(dataTypes) || dataTypes.length === 0) {
      return NextResponse.json({ error: "data_types must be a non-empty array" }, { status: 400 });
    }

    const validated = dataTypes.filter((t): t is DataType =>
      typeof t === "string" && VALID_DATA_TYPES.includes(t as DataType)
    );

    if (validated.length === 0) {
      return NextResponse.json(
        { error: `Invalid data types. Valid options: ${VALID_DATA_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    await callChatView("/accounts/me/data-deletion/", "POST", {
      token,
      body: { data_types: validated },
    });

    return NextResponse.json({ message: "Data deletion request submitted", data_types: validated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit data deletion request" },
      { status: 400 }
    );
  }
}
