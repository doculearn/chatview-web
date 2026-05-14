"use client";

import Link from "next/link";

const PUBLIC_PLANS = [
  {
    name: "free",
    display_name: "Free",
    price: "0",
    blurb: "Try it out, no card required",
    accent: "border-white/15",
    cta: "Create account",
    features: [
      "1 mobile device",
      "Basic prompts to your phone",
      "Community support",
    ],
  },
  {
    name: "starter",
    display_name: "Solo",
    price: "9.99",
    blurb: "For individual developers",
    accent: "border-(--accent)/40 shadow-[0_0_30px_rgba(26,166,255,0.18)]",
    cta: "Subscribe — $9.99/mo",
    features: [
      "1 mobile device",
      "MCP server + VS Code extension",
      "Unlimited prompts",
      "Email support",
    ],
  },
  {
    name: "pro",
    display_name: "Pro",
    price: "29.99",
    blurb: "For power users & small teams",
    accent: "border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.18)]",
    cta: "Subscribe — $29.99/mo",
    badge: "Most Popular",
    features: [
      "5 mobile devices",
      "Everything in Solo",
      "Priority support",
      "Early access to new features",
    ],
  },
];

export function PublicPricing() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {PUBLIC_PLANS.map((plan) => (
          <article
            key={plan.name}
            className={`feature-card border ${plan.accent} p-5 flex flex-col`}
          >
            {plan.badge ? (
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                {plan.badge}
              </p>
            ) : (
              <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                &nbsp;
              </p>
            )}
            <p className="mt-1 text-sm font-semibold text-(--accent-2)">
              {plan.display_name}
            </p>
            <p className="mt-2 text-3xl font-bold">
              ${plan.price}
              <span className="text-sm font-normal text-(--muted)">
                {plan.price === "0" ? "" : "/mo"}
              </span>
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-(--muted)">
              {plan.blurb}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-(--muted)">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span className="text-(--accent)">✓</span> {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.name === "free" ? "/register" : `/login?next=/pricing`}
              className={`mt-5 w-full block rounded-xl px-4 py-2 text-center text-sm font-semibold transition-colors ${
                plan.name === "pro"
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-(--accent) text-white hover:bg-(--accent)/80"
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>

      <p className="text-center text-xs text-(--muted)">
        Already have an account?{" "}
        <Link href="/login?next=/pricing" className="text-(--accent) hover:underline">
          Sign in to manage your subscription
        </Link>
        .
      </p>
    </div>
  );
}
