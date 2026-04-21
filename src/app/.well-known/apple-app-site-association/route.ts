import { NextResponse } from "next/server";

function getEnvList(name: string): string[] {
  const value = process.env[name] ?? "";
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET() {
  const appIds = getEnvList("CHATVIEW_IOS_APP_IDS");

  const payload = {
    applinks: {
      apps: [],
      details: appIds.map((appId) => ({
        appIDs: [appId],
        components: [
          {
            "/": "/qr-login",
            "?": {
              token: "*",
            },
            comment: "Allow QR login links to open in ChatView mobile",
          },
        ],
      })),
    },
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "application/json",
    },
  });
}
