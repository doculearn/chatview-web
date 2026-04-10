"use client";

import { Suspense } from "react";
import { SubscriptionReturnContent } from "@/components/subscription/SubscriptionReturn";
import { PageShell } from "@/components/page-shell";

export default function SubscriptionReturnPage() {
  return (
    <PageShell activePath="/subscription">
      <Suspense
        fallback={
          <div className="glass-panel float-up rounded-3xl p-10 text-center">
            <p className="text-(--muted)">Checking payment status...</p>
          </div>
        }
      >
        <SubscriptionReturnContent />
      </Suspense>
    </PageShell>
  );
}
