import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  // Admin-only surface — never index, never follow links from here.
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
