import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you were looking for doesn't exist on ChatView. Head back to the homepage or jump straight to your account.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/404",
  },
  openGraph: {
    title: "Page not found | ChatView",
    description:
      "The page you were looking for doesn't exist on ChatView. Head back to the homepage or jump straight to your account.",
    url: "https://chat-view.xyz/404",
    siteName: "ChatView",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Page not found | ChatView",
    description:
      "The page you were looking for doesn't exist on ChatView.",
  },
};

const QUICK_LINKS: Array<{ href: string; label: string; description: string }> = [
  {
    href: "/",
    label: "Home",
    description: "Drive VS Code, Claude Code & Cursor from your phone.",
  },
  {
    href: "/pricing",
    label: "Pricing",
    description: "Plans and what's included, in your local currency.",
  },
  {
    href: "/account",
    label: "Your account",
    description: "Sign in to manage your subscription and devices.",
  },
  {
    href: "/support",
    label: "Support",
    description: "Help articles and a contact form for our team.",
  },
];

export default function NotFound() {
  return (
    <PageShell activePath="/404">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-start gap-8 px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">
            Error 404
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-(--foreground) sm:text-5xl">
            We can't find that page.
          </h1>
          <p className="max-w-prose text-base text-(--muted) sm:text-lg">
            The link may be out of date, or the page has moved. Try one of the
            destinations below, or head back to the homepage.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-(--accent) px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Back to home
          </Link>
          <Link
            href="/account"
            className="inline-flex items-center justify-center rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-(--foreground) transition hover:border-white/30"
          >
            Go to your account
          </Link>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/25 hover:bg-white/[0.04]"
            >
              <span className="text-sm font-semibold text-(--foreground) group-hover:text-(--accent)">
                {link.label}
              </span>
              <span className="text-sm text-(--muted)">{link.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
