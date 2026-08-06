import { NextResponse } from "next/server";

const CHATVIEW_API_BASE_URL = (
  process.env.CHATVIEW_API_BASE_URL ?? "https://api.chatview.app/api/v1"
).replace(/\/+$/, "");

export async function GET() {
  try {
    const response = await fetch(`${CHATVIEW_API_BASE_URL}/accounts/auth/google/login/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(process.env.CHATVIEW_API_KEY ? { "X-API-KEY": process.env.CHATVIEW_API_KEY } : {}),
      },
      redirect: "manual",
    });

    // Backend returns JSON when Accept: application/json is sent
    const data = await response.json().catch(() => null);
    const authUrl = data?.auth_url;

    if (!authUrl || typeof authUrl !== "string") {
      return NextResponse.json(
        { error: "Failed to initiate Google OAuth" },
        { status: 502 },
      );
    }

    return NextResponse.redirect(authUrl, 302);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Google login init failed" },
      { status: 500 },
    );
  }
}
