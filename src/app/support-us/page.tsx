import { PageShell } from "@/components/page-shell";
import { BuyCoffee } from "@/components/buy-coffee";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support ChatView · Buy us a coffee",
  description:
    "ChatView is built by an indie hacker. Tip the project to help fund servers, features, and late-night commits.",
  alternates: {
    canonical: "/support-us",
  },
  openGraph: {
    title: "Support ChatView · Buy us a coffee",
    description:
      "ChatView is built by an indie hacker. Tip the project to help fund servers, features, and late-night commits.",
    url: "https://chat-view.xyz/support-us",
    siteName: "ChatView",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Support ChatView · Buy us a coffee",
    description:
      "Tip the project to help fund servers, features, and late-night commits.",
  },
};

export default function SupportUsPage() {
  return (
    <PageShell activePath="/support-us">
      <BuyCoffee />
    </PageShell>
  );
}
