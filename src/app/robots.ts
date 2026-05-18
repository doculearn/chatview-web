import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://chat-view.xyz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/account/",
          "/callback/",
          "/subscription/cancel",
          "/subscription/return",
          "/subscription/success",
          "/beta/accept",
          "/qr-login",
          "/qr/view",
          "/support/new",
          "/support/submitted",
          "/support/tickets",
          "/delete-account",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
