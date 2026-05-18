import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your ChatView account",
  description: "Create your ChatView account to pair your phone with VS Code, Cursor, Claude Code or Codex.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: true },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
