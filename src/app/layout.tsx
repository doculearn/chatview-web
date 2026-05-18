import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chat-view.xyz"),
  title: {
    default: "ChatView | Remote coding that stays in motion",
    template: "%s | ChatView",
  },
  description:
    "ChatView pairs your phone with VS Code, Cursor, Claude Code and Codex so you can prompt the coding agent, review diffs, and approve edits from anywhere. Free tier + Pro. Built in public.",
  applicationName: "ChatView",
  keywords: [
    "ChatView",
    "Cursor mobile",
    "VS Code mobile",
    "Codex Mobile alternative",
    "Claude Code mobile",
    "remote coding",
    "AI coding agent",
    "mobile IDE",
    "pair programming",
    "developer tools",
  ],
  authors: [{ name: "William Mabotja", url: "https://chat-view.xyz" }],
  creator: "Doculearn",
  publisher: "Doculearn",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ChatView",
    url: "https://chat-view.xyz",
    title: "ChatView | Remote coding that stays in motion",
    description:
      "Pair your phone with Cursor, VS Code, Claude Code or Codex. Prompt the agent, review diffs, approve edits — from anywhere.",
    locale: "en_US",
    images: [
      {
        url: "/chatview-logo.png",
        width: 1200,
        height: 630,
        alt: "ChatView — chat with your IDE from anywhere",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@williammbtja",
    creator: "@williammbtja",
    title: "ChatView | Remote coding that stays in motion",
    description:
      "Pair your phone with Cursor, VS Code, Claude Code or Codex. Prompt the agent, review diffs, approve edits — from anywhere.",
    images: ["/chatview-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics gaId="G-9603SMF2Q3" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
