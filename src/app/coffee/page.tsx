import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { BuyCoffee } from "@/components/buy-coffee";
import { CoffeeShareButtons } from "@/components/coffee-share-buttons";

const TITLE = "Buy ChatView a coffee ☕";
const DESCRIPTION =
  "ChatView lets you vibe code from your phone — drive VS Code, Cursor, Claude Code & Codex CLI from anywhere, built by one indie hacker. Tip $5, $10 or $20 to fund servers, features and late-night commits.";
const URL = "https://chat-view.xyz/coffee";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "ChatView",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    site: "@chat_view",
    creator: "@chat_view",
  },
};

export default function CoffeePage() {
  return (
    <PageShell activePath="/coffee">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="glass-panel float-up rounded-2xl p-6 text-center sm:rounded-[2rem] sm:p-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
            Indie Built · No VC
          </span>

          <h1 className="headline-glow mt-5 text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Buy ChatView a{" "}
            <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
              coffee ☕
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-(--muted) sm:text-lg">
            ChatView lets you{" "}
            <span className="text-(--foreground)">
              vibe code from your phone — across VS Code, Claude Code, Codex CLI &amp; Cursor
            </span>{" "}
            — built by one indie hacker, one cup of coffee at a time. No VC
            money, no growth team, no SDR pipeline. Every tip goes straight
            back into servers, features, and late-night commits.
          </p>

          <div className="mt-7">
            <CoffeeShareButtons />
          </div>

          <p className="mt-4 text-xs text-(--muted)">
            Share this link:{" "}
            <span className="font-mono text-(--accent-2)">
              chat-view.xyz/coffee
            </span>
          </p>
        </div>
      </section>

      {/* ─── TIP TIERS ─────────────────────────────────────────────── */}
      <BuyCoffee />

      {/* ─── WHAT TIPS BUY ─────────────────────────────────────────── */}
      <section className="glass-panel float-up fade-delay-1 mt-10 rounded-2xl p-6 sm:rounded-[2rem] sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-(--accent)">
          Where the money goes
        </p>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
          Every dollar = more shipping.
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "☁️",
              title: "Servers & relay",
              body: "Azure Container Apps, Cosmos DB, and the secure WebSocket relay that connects your phone to your IDE.",
            },
            {
              n: "🔧",
              title: "New features",
              body: "Voice prompts, JetBrains support, more agents, on-device speech-to-text — the roadmap lives on tips.",
            },
            {
              n: "🌙",
              title: "Late-night commits",
              body: "Caffeine for the indie hacker shipping ChatView between day-job stand-ups.",
            },
          ].map((it) => (
            <div key={it.title} className="feature-card">
              <span className="text-2xl" aria-hidden>
                {it.n}
              </span>
              <p className="mt-2 text-sm font-semibold text-(--foreground)">
                {it.title}
              </p>
              <p className="mt-1 text-sm text-(--muted)">{it.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ALT CTA ───────────────────────────────────────────────── */}
      <section className="glass-panel float-up fade-delay-2 mt-10 rounded-2xl p-6 text-center sm:rounded-[2rem] sm:p-10">
        <h2 className="headline-glow text-2xl font-bold sm:text-3xl">
          Not in the tipping mood?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-(--muted) sm:text-base">
          Subscribing at $9.99/mo helps even more — and you actually get the
          product.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-6 py-3 font-semibold text-black transition hover:brightness-110"
          >
            Start a subscription
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) px-6 py-3 font-semibold text-(--foreground) transition hover:border-(--accent)"
          >
            See what ChatView does
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
