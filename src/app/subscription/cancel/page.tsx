"use client";

import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";

export default function SubscriptionCancelPage() {
  const router = useRouter();

  return (
    <PageShell activePath="/subscription">
      <section className="glass-panel float-up rounded-2xl p-6 sm:rounded-3xl sm:p-10 lg:p-14">
        <div className="mx-auto max-w-lg text-center">
          {/* Cancelled Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
              <span className="text-3xl">✕</span>
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">
            Checkout Cancelled
          </p>
          <h1 className="headline-glow mt-3 text-xl font-bold sm:text-3xl">
            Payment Cancelled
          </h1>
          <p className="mt-4 text-(--muted)">
            Your payment was cancelled and no charges were made. You can try again whenever
            you&apos;re ready.
          </p>

          {/* Free Plan Info */}
          <div className="mt-8 rounded-lg border border-white/10 bg-(--panel-soft) p-5">
            <p className="text-sm font-semibold">You still have access to our Free plan</p>
            <ul className="mt-3 space-y-2 text-left text-sm text-(--muted)">
              <li>
                <span className="text-(--accent)">✓</span> Basic AI conversations
              </li>
              <li>
                <span className="text-(--accent)">✓</span> Limited daily prompts
              </li>
              <li>
                <span className="text-(--accent)">✓</span> Community support
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push("/pricing")}
              className="rounded-xl bg-(--accent) px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--accent)/80"
            >
              View Plans Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-semibold text-(--foreground) transition-colors hover:border-(--accent) hover:bg-(--panel-soft)"
            >
              Go Home
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
