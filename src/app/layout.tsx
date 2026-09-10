import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, JetBrains_Mono, Noto_Sans_Devanagari, Noto_Sans_Kannada, Noto_Sans_Bengali, Noto_Sans_Tamil, Noto_Sans_Telugu, Noto_Sans_Gujarati, Noto_Sans_Gurmukhi, Noto_Sans_Malayalam, Noto_Sans_Oriya } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { UsermavenLite } from "@/components/usermaven-lite";
import {
  CookieConsent,
  ConsentGatedAnalytics,
} from "@/components/cookie-consent";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const devanagari = Noto_Sans_Devanagari({ variable: "--font-devanagari", preload: false });
const kannada = Noto_Sans_Kannada({ variable: "--font-kannada", preload: false });
const bengali = Noto_Sans_Bengali({ variable: "--font-bengali", preload: false });
const tamil = Noto_Sans_Tamil({ variable: "--font-tamil", preload: false });
const telugu = Noto_Sans_Telugu({ variable: "--font-telugu", preload: false });
const gujarati = Noto_Sans_Gujarati({ variable: "--font-gujarati", preload: false });
const gurmukhi = Noto_Sans_Gurmukhi({ variable: "--font-gurmukhi", preload: false, weight: ["400", "700"] });
const malayalam = Noto_Sans_Malayalam({ variable: "--font-malayalam", preload: false });
const odia = Noto_Sans_Oriya({ variable: "--font-odia", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL("https://chat-view.xyz"),
  title: {
    default: "Vibe Code From Your Phone | ChatView",
    template: "%s | ChatView",
  },
  description:
    "Vibe code from your phone with ChatView. Drive VS Code, Cursor, Claude Code and Codex CLI from anywhere — queue prompts, review diffs, and approve edits on the go. Start a free 7-day trial, no card required.",
  applicationName: "ChatView",
  keywords: [
    "vibe code from your phone",
    "vibe coding",
    "vibe coding app",
    "code from your phone",
    "ChatView",
    "Cursor mobile",
    "VS Code mobile",
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
    title: "Vibe Code From Your Phone | ChatView",
    description:
      "Vibe code from your phone. Drive Cursor, VS Code, Claude Code or Codex CLI from anywhere — prompt the agent, review diffs, approve edits. Free 7-day trial, no card required.",
    locale: "en_US",
    images: [
      {
        url: "/chatview-logo.png",
        width: 1200,
        height: 630,
        alt: "ChatView — vibe code from your phone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@williammbtja",
    creator: "@williammbtja",
    title: "Vibe Code From Your Phone | ChatView",
    description:
      "Vibe code from your phone. Drive Cursor, VS Code, Claude Code or Codex CLI from anywhere. Free 7-day trial, no card required.",
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${devanagari.variable} ${kannada.variable} ${bengali.variable} ${tamil.variable} ${telugu.variable} ${gujarati.variable} ${gurmukhi.variable} ${malayalam.variable} ${odia.variable} h-full antialiased`}
    >
      <meta name="msvalidate.01" content="B91F1C8AC71E2CC150001185B1C342F9" />
      <body className="min-h-full flex flex-col">
        {/* Google Analytics sets cookies, so it loads only after opt-in. */}
        <ConsentGatedAnalytics />
        {/* Cookieless in-house analytics. useSearchParams forces this
            into a Suspense boundary in Next.js 14+. */}
        <Suspense fallback={null}>
          <UsermavenLite />
        </Suspense>
        <Providers>{children}</Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
