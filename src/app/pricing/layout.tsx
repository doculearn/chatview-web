import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for ChatView. Drive VS Code, Claude Code & Cursor from your phone — plans shown in your local currency.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing | ChatView",
    description:
      "Simple, transparent pricing for ChatView. Plans shown in your local currency.",
    url: "https://chat-view.xyz/pricing",
    siteName: "ChatView",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | ChatView",
    description:
      "Simple, transparent pricing for ChatView. Plans shown in your local currency.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
