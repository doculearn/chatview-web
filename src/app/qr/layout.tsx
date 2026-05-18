import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pair your device",
  description: "Scan the QR code to pair the ChatView mobile app with this browser session.",
  alternates: { canonical: "/qr" },
  robots: { index: false, follow: true },
};

export default function QRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
