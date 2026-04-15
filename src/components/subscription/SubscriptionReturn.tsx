"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";

type SubscriptionStatus = {
  id: string;
  status: string;
  is_active: boolean;
  plan: {
    name: string;
    display_name: string;
    price: string;
  };
  next_payment_date: string | null;
};

type WorkflowStep = "processing" | "completed" | "failed" | "cancelled";

export function SubscriptionReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>("processing");
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);
  const MAX_POLLS = 40; // ~2 minutes at 3s intervals

  useEffect(() => {
    const status = searchParams?.get("status");
    const cancelled = searchParams?.get("cancelled");

    if (cancelled === "true" || status === "cancel" || status === "cancelled") {
      setWorkflowStep("cancelled");
      return;
    }

    // Start polling for subscription activation
    startStatusPolling();

    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Auto-redirect on completion
  useEffect(() => {
    if (workflowStep === "completed") {
      const timer = setTimeout(() => {
        router.push("/subscription/success");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [workflowStep, router]);

  function stopPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }

  async function checkSubscriptionStatus() {
    try {
      const res = await authFetch("/api/chatview/subscription/current");
      const data = await res.json().catch(() => null);

      if (res.ok && data) {
        const sub = data.subscription ?? data;
        setSubscription(sub);

        if (sub.status === "active" || sub.is_active) {
          stopPolling();
          try {
            localStorage.setItem("chatview_confirmed_plan", sub.plan?.display_name ?? "");
          } catch {
            // localStorage may not be available
          }
          setWorkflowStep("completed");
          return;
        }

        if (sub.status === "failed") {
          stopPolling();
          setWorkflowStep("failed");
          return;
        }

        if (sub.status === "cancelled") {
          stopPolling();
          setWorkflowStep("cancelled");
          return;
        }

        // Still pending — ask the backend to check Dodo directly
        if (sub.status === "pending") {
          try {
            const verifyRes = await authFetch("/api/chatview/subscription/verify", {
              method: "POST",
            });
            const verifyData = await verifyRes.json().catch(() => null);
            if (verifyRes.ok && verifyData?.status === "active") {
              const activeSub = verifyData.subscription ?? sub;
              setSubscription(activeSub);
              stopPolling();
              try {
                localStorage.setItem("chatview_confirmed_plan", activeSub.plan?.display_name ?? "");
              } catch {
                // localStorage may not be available
              }
              setWorkflowStep("completed");
              return;
            }
          } catch {
            // Verify failed — continue polling
          }
        }
      }
    } catch {
      // Silently continue polling — network blip
    }

    pollCountRef.current += 1;
    if (pollCountRef.current >= MAX_POLLS) {
      stopPolling();
      setError("Payment confirmation is taking longer than expected. Please check your account page shortly.");
      setWorkflowStep("failed");
    }
  }

  function startStatusPolling() {
    // Check immediately
    checkSubscriptionStatus();

    // Then poll every 3 seconds
    pollingRef.current = setInterval(checkSubscriptionStatus, 3000);
  }

  const statusDisplay = getStatusDisplay(workflowStep);

  return (
    <section className="glass-panel float-up rounded-2xl p-6 sm:rounded-3xl sm:p-10 lg:p-14">
      <div className="mx-auto max-w-lg text-center">
        {/* Status Icon */}
        <div className="mb-6 flex justify-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${statusDisplay.iconBg}`}
          >
            {statusDisplay.icon}
          </div>
        </div>

        {/* Title & Message */}
        <h2 className="headline-glow text-xl font-bold sm:text-3xl">{statusDisplay.title}</h2>
        <p className="mt-3 text-(--muted)">{statusDisplay.message}</p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Processing spinner */}
        {workflowStep === "processing" && (
          <div className="mt-8">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-(--accent)/30 border-t-(--accent)" />
            <p className="mt-3 text-xs text-(--muted)">
              This may take a few moments. Please don&apos;t close this window.
            </p>
          </div>
        )}

        {/* Subscription info on success */}
        {workflowStep === "completed" && subscription && (
          <div className="mt-6 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-sm text-green-400">
              ✓ Your {subscription.plan?.display_name} plan is now active
            </p>
            {subscription.next_payment_date && (
              <p className="mt-1 text-xs text-(--muted)">
                Next billing date:{" "}
                {new Date(subscription.next_payment_date).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {workflowStep === "completed" && (
            <>
              <button
                onClick={() => router.push("/subscription/success")}
                className="rounded-xl bg-(--accent) px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--accent)/80"
              >
                Continue
              </button>
              <button
                onClick={() => router.push("/account")}
                className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-semibold text-(--foreground) transition-colors hover:border-(--accent) hover:bg-(--panel-soft)"
              >
                Go to Account
              </button>
            </>
          )}

          {(workflowStep === "cancelled" || workflowStep === "failed") && (
            <>
              <button
                onClick={() => router.push("/pricing")}
                className="rounded-xl bg-(--accent) px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--accent)/80"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-semibold text-(--foreground) transition-colors hover:border-(--accent) hover:bg-(--panel-soft)"
              >
                Go Home
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function getStatusDisplay(step: WorkflowStep) {
  switch (step) {
    case "completed":
      return {
        icon: "✓",
        iconBg: "bg-green-500/10 text-green-400",
        title: "Payment Successful!",
        message: "Your subscription is now active. Redirecting...",
      };
    case "cancelled":
      return {
        icon: "✕",
        iconBg: "bg-yellow-500/10 text-yellow-400",
        title: "Payment Cancelled",
        message: "Your payment was cancelled. No charges were made.",
      };
    case "failed":
      return {
        icon: "!",
        iconBg: "bg-red-500/10 text-red-400",
        title: "Payment Failed",
        message: "There was an issue processing your payment. Please try again.",
      };
    default:
      return {
        icon: "⟳",
        iconBg: "bg-blue-500/10 text-blue-400",
        title: "Processing Payment...",
        message: "Please wait while we confirm your subscription.",
      };
  }
}
