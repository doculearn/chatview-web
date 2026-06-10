"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { PublicPricing } from "@/components/subscription/PublicPricing";
import { useAuthReady } from "@/hooks/use-auth-ready";
import { track } from "@/lib/cv-analytics";

export default function PricingPage() {
  const isAuthenticated = useAuthReady();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    track("pricing_viewed");
  }, []);

  return (
    <PageShell activePath="/pricing">
      <div className="space-y-6">
        <section className="glass-panel float-up rounded-2xl p-5 sm:rounded-[2rem] sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="headline-glow text-xl font-bold sm:text-2xl">
              Simple, transparent pricing
            </h1>
          </div>
          <p className="mt-3 text-sm text-(--muted) sm:text-base">
            Vibe code from your phone. Start free for 7 days — no card required. Cancel anytime, no
            contracts, no surprises.
          </p>
        </section>

        {/* Render PublicPricing during SSR + first paint to avoid auth-flicker;
            swap to SubscriptionManager once mounted and the user is signed in. */}
        {mounted && isAuthenticated ? <SubscriptionManager /> : <PublicPricing />}
      </div>
    </PageShell>
  );
}
