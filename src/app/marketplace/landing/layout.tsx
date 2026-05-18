import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace landing",
  description: "Activate your ChatView subscription purchased through the Microsoft Marketplace.",
  alternates: { canonical: "/marketplace/landing" },
  robots: { index: false, follow: false },
};

export default function MarketplaceLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
