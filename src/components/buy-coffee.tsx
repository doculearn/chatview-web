"use client";

import { useState } from "react";

type Tier = {
  amount: 5 | 10 | 20;
  emoji: string;
  label: string;
  blurb: string;
};

const TIERS: Tier[] = [
  { amount: 5, emoji: "☕", label: "Coffee", blurb: "Keeps the late-night commits flowing" },
  { amount: 10, emoji: "🍔", label: "Lunch", blurb: "Fuels a feature you've been wanting" },
  { amount: 20, emoji: "🚀", label: "Sprint", blurb: "Sponsors a full evening of focused work" },
];

export function BuyCoffee() {
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTip(amount: number) {
    try {
      setLoading(amount);
      setError(null);
      const res = await fetch("/api/chatview/tip/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok || !data.payment_link) {
        throw new Error(data.error || "Failed to start checkout");
      }
      window.location.href = data.payment_link;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start checkout");
      setLoading(null);
    }
  }

  return (
    <section className="glass-panel float-up rounded-2xl p-5 sm:rounded-3xl sm:p-7 lg:p-9">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
          Indie Built
        </span>
        <h2 className="headline-glow text-xl font-bold sm:text-2xl">
          Buy us a coffee
        </h2>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-(--muted) sm:text-base">
        ChatView is built by an indie hacker — one developer, one cup of coffee
        at a time. There&apos;s no VC money, no growth team, no SDR pipeline.
        Every tip goes straight back into shipping features, paying for servers,
        and keeping the lights on. If ChatView has saved you time, consider
        chipping in.
      </p>

      {error && (
        <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {TIERS.map((tier) => {
          const isLoading = loading === tier.amount;
          return (
            <button
              key={tier.amount}
              type="button"
              onClick={() => handleTip(tier.amount)}
              disabled={loading !== null}
              className="feature-card border border-(--line) hover:border-amber-500/60 transition-colors p-5 flex flex-col items-center text-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
              <span className="text-3xl" aria-hidden>
                {tier.emoji}
              </span>
              <p className="mt-2 text-2xl font-bold">${tier.amount}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-(--accent-2)">
                {tier.label}
              </p>
              <p className="mt-2 text-xs text-(--muted)">{tier.blurb}</p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-amber-300">
                {isLoading ? "Opening checkout…" : "Tip via Dodo →"}
              </p>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-(--muted)">
        Tips are one-time and processed by Dodo Payments. They&apos;re not tax
        deductible and don&apos;t change your subscription.
      </p>
    </section>
  );
}
