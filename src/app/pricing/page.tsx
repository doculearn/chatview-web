"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { PublicPricing } from "@/components/subscription/PublicPricing";
import { useAuthReady } from "@/hooks/use-auth-ready";

export default function PricingPage() {
  const isAuthenticated = useAuthReady();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PageShell activePath="/pricing">
      <div className="space-y-6">
        <section className="glass-panel float-up rounded-2xl p-5 sm:rounded-[2rem] sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-(--accent) px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
              3 days free
            </span>
            <h1 className="headline-glow text-xl font-bold sm:text-2xl">
              Try every plan free for 3 days
            </h1>
          </div>
          <p className="mt-3 text-sm text-(--muted) sm:text-base">
            Pick a plan, get full access for 3 days, and keep going only if it&apos;s a fit. Cancel anytime before day 3 to avoid being charged.
          </p>
        </section>

        {/* Render PublicPricing during SSR + first paint to avoid auth-flicker;
            swap to SubscriptionManager once mounted and the user is signed in. */}
        {mounted && isAuthenticated ? <SubscriptionManager /> : <PublicPricing />}
      </div>
    </PageShell>
  );
}
