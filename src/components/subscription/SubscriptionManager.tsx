"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { track } from "@/lib/cv-analytics";
import { CancellationForm } from "./CancellationForm";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { PlanSelector } from "./PlanSelector";

type Subscription = {
  id: string;
  status: string;
  is_active: boolean;
  is_cancelled: boolean;
  plan: {
    name: string;
    display_name: string;
    price: string;
  };
  start_date: string | null;
  next_payment_date: string | null;
  access_expires_at: string | null;
  has_access: boolean;
  days_until_access_expires: number | null;
};

type SubscriptionPlan = {
  id: number;
  name: string;
  display_name: string;
  price: string;
  description: string;
  features: string[];
};

export function SubscriptionManager() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancellationForm, setShowCancellationForm] = useState(false);
  const [activating, setActivating] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      async function fetchWithTimeout(url: string, timeoutMs = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const res = await authFetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          return res;
        } catch (error) {
          clearTimeout(timeoutId);
          if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out');
          }
          throw error;
        }
      }

      const [subRes, plansRes] = await Promise.all([
        fetchWithTimeout("/api/chatview/subscription/current"),
        fetchWithTimeout("/api/chatview/subscription/plans"),
      ]);

      const subData = await subRes.json().catch(() => null);
      const plansData = await plansRes.json().catch(() => null);

      if (subRes.ok) {
        setSubscription(subData?.subscription || null);
      }
      if (plansRes.ok) {
        setPlans(plansData?.plans || []);
      }

      if (!subRes.ok || !plansRes.ok) {
        setError("Failed to load subscription data");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error loading subscription information");
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate() {
    try {
      setActivating(true);
      setError(null);

      const planName = subscription?.plan?.name;
      if (!planName) {
        setError("No plan found. Please select a plan first.");
        return;
      }
      track("plan_selected", { plan: planName, source: "activate", authed: true });

      const response = await authFetch("/api/chatview/subscription/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || data?.detail || "Failed to initiate payment checkout");
        track("checkout_failed", { plan: planName, reason: data?.error || data?.detail || "unknown" });
        return;
      }

      // Redirect to checkout if URL is provided
      const checkoutUrl = data?.checkout_url || data?.payment_url;
      if (checkoutUrl) {
        track("checkout_started", { plan: planName });
        window.location.href = checkoutUrl;
        return;
      }

      // If no checkout URL, the backend may have activated directly (free plan)
      await loadData();
    } catch {
      setError("Error initiating payment. Please try again.");
    } finally {
      setActivating(false);
    }
  }

  async function handleDeactivate() {
    try {
      setDeactivating(true);
      setError(null);
      const response = await authFetch("/api/chatview/subscription/deactivate", {
        method: "POST",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || "Failed to deactivate subscription");
        return;
      }
      await loadData();
    } catch {
      setError("Error deactivating subscription");
    } finally {
      setDeactivating(false);
    }
  }

  async function handleUpgrade(planName: string) {
    try {
      setError(null);
      track("plan_selected", { plan: planName, source: "upgrade", authed: true });
      const response = await authFetch("/api/chatview/subscription/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || "Failed to initiate subscription");
        track("checkout_failed", { plan: planName, reason: data?.error || data?.detail || "unknown" });
        return;
      }

      if (data?.checkout_url) {
        track("checkout_started", { plan: planName });
        window.location.href = data.checkout_url;
      } else {
        // Free plan or already active
        await loadData();
      }
    } catch {
      setError("Error starting checkout");
    }
  }

  async function handleCancellationSubmit(reasonData: {
    reason: string;
    additional_feedback: string;
    would_return: boolean;
    return_reason: string;
  }) {
    try {
      setError(null);
      const response = await authFetch("/api/chatview/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reasonData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || "Failed to cancel subscription");
        return;
      }

      setShowCancellationForm(false);
      await loadData();
    } catch {
      setError("Error cancelling subscription");
    }
  }

  if (loading) {
    return (
      <div className="glass-panel float-up rounded-3xl p-6 sm:p-10">
        <p className="text-(--muted)">Loading subscription information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="glass-panel rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {subscription ? (
        <>
          <SubscriptionStatus
            subscription={subscription}
            onCancelClick={() => setShowCancellationForm(true)}
            onActivateClick={handleActivate}
            onDeactivateClick={handleDeactivate}
            onChangePlanClick={subscription.is_active ? () => setShowPlanSelector(!showPlanSelector) : undefined}
            activating={activating}
            deactivating={deactivating}
          />
          {showPlanSelector && (
            <PlanSelector
              plans={plans}
              currentPlanName={subscription.plan.name}
              onSelectPlan={async (planName) => {
                await handleUpgrade(planName);
                setShowPlanSelector(false);
              }}
            />
          )}
          {showCancellationForm && (
            <CancellationForm
              subscription={subscription}
              onSubmit={handleCancellationSubmit}
              onCancel={() => setShowCancellationForm(false)}
            />
          )}
        </>
      ) : (
        <PlanSelector
          plans={plans}
          onSelectPlan={handleUpgrade}
        />
      )}
    </div>
  );
}
