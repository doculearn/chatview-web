"use client";
import { Localized } from "@/components/localized";


import Link from "next/link";
import { TrackedLink } from "@/components/tracked-link";
import { MicrosoftMarketplaceCta } from "./MicrosoftMarketplaceCta";

const PUBLIC_PLANS = [
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
];

export function PublicPricing() {
  return (
    <Localized><div className="space-y-6">
      <div className="rounded-2xl border border-(--accent)/30 bg-(--accent)/5 px-4 py-3 text-center text-sm text-(--foreground)">
        <span className="font-semibold text-(--accent)">One simple paid plan</span>
        <span className="text-(--muted)"> — $9.99/month. Cancel anytime.</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {PUBLIC_PLANS.map((plan) => (
          <article
            key={plan.name}
            className={`feature-card border ${plan.accent} p-5 flex flex-col`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
              &nbsp;
            </p>
            <p className="mt-1 text-sm font-semibold text-(--accent-2)">
              {plan.display_name}
            </p>
            <p className="mt-2 text-3xl font-bold">
              ${plan.price}
              <span className="text-sm font-normal text-(--muted)">/mo</span>
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
            <TrackedLink
              href="/login?next=/pricing"
              location="public_pricing_card"
              target="login"
              event="plan_selected"
              extra={{ plan: plan.name, price: plan.price, authed: false }}
              className="mt-5 w-full block rounded-xl bg-(--accent) px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-(--accent)/80"
            >
              {plan.cta}
            </TrackedLink>
          </article>
        ))}
      </div>

      <MicrosoftMarketplaceCta location="public_pricing" />

      <p className="text-center text-xs text-(--muted)">
        Already have an account?{" "}
        <Link href="/login?next=/pricing" className="text-(--accent) hover:underline">
          Sign in to manage your subscription
        </Link>
        .
      </p>
    </div></Localized>
  );
}
