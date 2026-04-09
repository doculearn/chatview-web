"use client";

import { useState } from "react";

type Plan = {
  id: number;
  name: string;
  display_name: string;
  price: string;
  description: string;
  features: string[];
};

type PlanSelectorProps = {
  plans: Plan[];
  onSelectPlan: (planName: string) => Promise<void>;
};

export function PlanSelector({ plans, onSelectPlan }: PlanSelectorProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelectPlan(planName: string) {
    try {
      setLoading(planName);
      setError(null);
      await onSelectPlan(planName);
    } catch {
      setError("Failed to start checkout");
    } finally {
      setLoading(null);
    }
  }

  const starterPlan = plans.find((p) => p.name === "starter");
  const proPlan = plans.find((p) => p.name === "pro");
  const enterprisePlan = plans.find((p) => p.name === "enterprise");

  return (
    <section className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
      <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Choose Your Plan</p>
      <h2 className="headline-glow mt-3 text-xl font-bold sm:text-3xl lg:text-4xl">
        Pick Your Subscription
      </h2>
      <p className="mt-4 max-w-3xl text-(--muted)">
        Get the most out of ChatView with a paid subscription. Upgrade anytime to unlock premium features.
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3">
        {/* Starter Plan */}
        {starterPlan && (
          <article className="feature-card border-(--accent) shadow-[0_0_30px_rgba(26,166,255,0.22)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-(--accent-2)">Starter</p>
            <p className="mt-1 text-sm font-semibold text-(--accent-2)">{starterPlan.display_name}</p>
            <p className="mt-2 text-3xl font-bold">${starterPlan.price}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">per month &middot; 1 device</p>
            <p className="mt-4 text-sm text-(--muted)">{starterPlan.description}</p>
            
            {starterPlan.features && starterPlan.features.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-(--muted)">
                {starterPlan.features.map((feature) => (
                  <li key={feature}>
                    <span className="text-(--accent)">✓</span> {feature}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => handleSelectPlan("starter")}
              disabled={loading === "starter"}
              className="mt-5 w-full rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-white hover:bg-(--accent)/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "starter" ? "Processing..." : "Choose Starter — $19/mo"}
            </button>
          </article>
        )}

        {/* Pro Plan */}
        {proPlan && (
          <article className="feature-card border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.18)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">Most Popular</p>
            <p className="mt-1 text-sm font-semibold text-amber-400">{proPlan.display_name}</p>
            <p className="mt-2 text-3xl font-bold">${proPlan.price}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">per month &middot; 5 devices</p>
            <p className="mt-4 text-sm text-(--muted)">{proPlan.description}</p>
            
            {proPlan.features && proPlan.features.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-(--muted)">
                {proPlan.features.map((feature) => (
                  <li key={feature}>
                    <span className="text-amber-400">✓</span> {feature}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => handleSelectPlan("pro")}
              disabled={loading === "pro"}
              className="mt-5 w-full rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "pro" ? "Processing..." : "Choose Pro — $50/mo"}
            </button>
          </article>
        )}

        {/* Enterprise Plan */}
        {enterprisePlan && (
          <article className="feature-card border-purple-500/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-400">Enterprise</p>
            <p className="mt-1 text-sm font-semibold text-purple-400">{enterprisePlan.display_name}</p>
            <p className="mt-2 text-3xl font-bold">Custom</p>
            <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">tailored pricing &middot; unlimited devices</p>
            <p className="mt-4 text-sm text-(--muted)">{enterprisePlan.description}</p>
            
            {enterprisePlan.features && enterprisePlan.features.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-(--muted)">
                {enterprisePlan.features.map((feature) => (
                  <li key={feature}>
                    <span className="text-purple-400">✓</span> {feature}
                  </li>
                ))}
              </ul>
            )}

            <a
              href="mailto:hello@chat-view.xyz?subject=ChatView Enterprise Inquiry"
              className="mt-5 block w-full rounded-xl bg-purple-500/20 border border-purple-500/50 px-4 py-2 text-center text-sm font-semibold text-purple-400 hover:bg-purple-500/30 transition-colors"
            >
              Contact Sales
            </a>
          </article>
        )}
      </div>

      {/* Free Plan Note */}
      <div className="mt-6 rounded-lg bg-green-500/5 border border-green-500/20 p-4">
        <p className="text-sm text-(--muted)">
          Already enjoying our <strong>Free Plan</strong>? Upgrade to Starter or Pro to unlock unlimited sessions,
          priority sync, and prompt templates.
        </p>
      </div>
    </section>
  );
}
