import { NextResponse } from "next/server";

function getEnvList(name: string): string[] {
  const value = process.env[name] ?? "";
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET() {
  const packageName = process.env.CHATVIEW_ANDROID_PACKAGE_NAME ?? "com.chatviewmobile";
  const fingerprints = getEnvList("CHATVIEW_ANDROID_SHA256_CERT_FINGERPRINTS");

  const payload = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: packageName,
        sha256_cert_fingerprints: fingerprints,
      },
    },
  ];

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
