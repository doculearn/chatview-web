import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for ChatView. Vibe code from your phone with VS Code, Cursor, Claude Code & Codex CLI. Free 7-day trial, no card required — plans shown in your local currency.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing | ChatView",
    description:
      "Vibe code from your phone. Free 7-day trial, no card required. Plans shown in your local currency.",
    url: "https://chat-view.xyz/pricing",
    siteName: "ChatView",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | ChatView",
    description:
      "Vibe code from your phone. Free 7-day trial, no card required. Plans shown in your local currency.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
