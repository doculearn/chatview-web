import { NextResponse } from "next/server";

// Microsoft Commercial Marketplace may POST form-encoded `token` to the
// landing URL. Convert that into a browser-friendly redirect so the
// client-side page can pick the token up from the query string.
export async function POST(req: Request) {
  let token = "";
  const ct = req.headers.get("content-type") || "";
  try {
    if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
      const form = await req.formData();
      token = String(form.get("token") ?? "");
    } else if (ct.includes("application/json")) {
      const body = await req.json();
      token = String((body as { token?: string })?.token ?? "");
    }
  } catch {
    token = "";
  }
  const url = new URL("/marketplace/landing", req.url);
  if (token) url.searchParams.set("token", token);
  return NextResponse.redirect(url, 303);
}

export async function GET(req: Request) {
  const incoming = new URL(req.url);
  const token = incoming.searchParams.get("token") || "";
  const url = new URL("/marketplace/landing", req.url);
  if (token) url.searchParams.set("token", token);
  return NextResponse.redirect(url, 303);
}
