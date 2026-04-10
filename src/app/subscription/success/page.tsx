"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { authFetch } from "@/lib/auth-fetch";

type Subscription = {
  plan: { display_name: string; price: string };
  next_payment_date: string | null;
  project_credits: number | null;
};

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Fetch latest subscription info
    authFetch("/api/chatview/subscription/current")
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json().catch(() => null);
          setSubscription(data?.subscription ?? data);
        }
      })
      .catch(() => {});

    // Animate in
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const planName =
    subscription?.plan?.display_name ??
    (() => {
      try {
        return localStorage.getItem("chatview_confirmed_plan") ?? "your plan";
      } catch {
        return "your plan";
      }
    })();

  return (
    <PageShell activePath="/subscription">
      <section
        className={`glass-panel float-up rounded-2xl p-6 sm:rounded-3xl sm:p-10 lg:p-14 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="mx-auto max-w-2xl text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <span className="text-4xl">🎉</span>
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">
            Subscription Confirmed
          </p>
          <h1 className="headline-glow mt-3 text-2xl font-bold sm:text-4xl">
            Welcome to ChatView!
          </h1>
          <p className="mt-4 text-(--muted)">
            Your <strong className="text-(--foreground)">{planName}</strong> plan is now active.
            Start exploring AI-powered conversations with full access to all premium features.
          </p>

          {/* Plan Benefits */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="feature-card p-4 text-center">
              <span className="text-2xl">💬</span>
              <p className="mt-2 text-sm font-semibold">AI Conversations</p>
              <p className="mt-1 text-xs text-(--muted)">
                Unlimited access to AI-powered chat sessions
              </p>
            </div>
            <div className="feature-card p-4 text-center">
              <span className="text-2xl">⚡</span>
              <p className="mt-2 text-sm font-semibold">Priority Access</p>
              <p className="mt-1 text-xs text-(--muted)">
                Faster responses and priority queue access
              </p>
            </div>
            <div className="feature-card p-4 text-center">
              <span className="text-2xl">📊</span>
              <p className="mt-2 text-sm font-semibold">Usage Analytics</p>
              <p className="mt-1 text-xs text-(--muted)">
                Track your AI usage with detailed statistics
              </p>
            </div>
          </div>

          {/* Subscription Details */}
          {subscription && (
            <div className="mt-8 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
              <div className="flex flex-col gap-2 text-sm sm:flex-row sm:justify-center sm:gap-6">
                <span>
                  <span className="text-(--muted)">Plan:</span>{" "}
                  <strong>{subscription.plan?.display_name}</strong>
                </span>
                <span>
                  <span className="text-(--muted)">Price:</span>{" "}
                  <strong>${subscription.plan?.price}/mo</strong>
                </span>
                {subscription.next_payment_date && (
                  <span>
                    <span className="text-(--muted)">Next billing:</span>{" "}
                    <strong>
                      {new Date(subscription.next_payment_date).toLocaleDateString()}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push("/account")}
              className="rounded-xl bg-(--accent) px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-(--accent)/80"
            >
              Go to Account →
            </button>
            <button
              onClick={() => router.push("/")}
              className="rounded-xl border border-white/10 px-8 py-3 text-sm font-semibold text-(--foreground) transition-colors hover:border-(--accent) hover:bg-(--panel-soft)"
            >
              Back to Home
            </button>
          </div>

          {/* Support Note */}
          <p className="mt-8 text-xs text-(--muted)">
            Need help? Contact us at{" "}
            <a href="mailto:hello@chat-view.xyz" className="text-(--accent) hover:underline">
              hello@chat-view.xyz
            </a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
