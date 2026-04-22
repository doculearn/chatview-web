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
  const defaultFingerprints = [
    "4B:6D:1B:CB:26:F6:D3:ED:B0:03:8D:71:61:34:1B:CB:1C:C4:07:EE:CC:08:C0:0B:6F:10:1E:98:3C:44:1C:39",
  ];
  const fingerprints = getEnvList("CHATVIEW_ANDROID_SHA256_CERT_FINGERPRINTS");
  const resolvedFingerprints = fingerprints.length > 0 ? fingerprints : defaultFingerprints;

  const payload = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: packageName,
        sha256_cert_fingerprints: resolvedFingerprints,
      },
    },
  ];

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
