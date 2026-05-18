import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beta access signup",
  description: "Join the ChatView private beta. Limited slots, prioritized by use case.",
  alternates: { canonical: "/beta-signup" },
  // Indexable — public landing for beta interest.
};

export default function BetaSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
