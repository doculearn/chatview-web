"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";
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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [subRes, plansRes] = await Promise.all([
        authFetch("/api/chatview/subscription/current"),
        authFetch("/api/chatview/subscription/plans"),
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
    } catch {
      setError("Error loading subscription information");
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate() {
    try {
      setActivating(true);
      setError(null);
      const response = await authFetch("/api/chatview/subscription/activate", {
        method: "POST",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || "Failed to activate subscription");
        return;
      }
      await loadData();
    } catch {
      setError("Error activating subscription");
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
      const response = await authFetch("/api/chatview/subscription/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || "Failed to initiate subscription");
        return;
      }

      if (data?.checkout_url) {
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
            activating={activating}
            deactivating={deactivating}
          />
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
