"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PageShell } from "@/components/page-shell";

type Plan = {
  id: number;
  name: string;
  display_name?: string;
  price?: string;
  description?: string;
  features?: string[];
};

export default function AccountPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [subscription, setSubscription] = useState<Record<string, unknown> | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [status, setStatus] = useState<string>("Loading account...");

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, subRes, planRes] = await Promise.all([
          fetch("/api/chatview/account"),
          fetch("/api/chatview/subscription/current"),
          fetch("/api/chatview/subscription/plans"),
        ]);

        const profileData = await profileRes.json().catch(() => null);
        const subData = await subRes.json().catch(() => null);
        const planData = await planRes.json().catch(() => null);

        if (profileRes.ok) setProfile(profileData);
        if (subRes.ok) setSubscription((subData?.subscription as Record<string, unknown> | null) ?? null);
        if (planRes.ok) setPlans(planData?.plans ?? []);

        if (!profileRes.ok || !subRes.ok || !planRes.ok) {
          setStatus("Some account data could not be loaded. If you signed in with Azure B2C, backend subscription endpoints may require token mapping.");
        } else {
          setStatus("Account loaded");
        }
      } catch {
        setStatus("Failed to load account data");
      }
    }

    load();
  }, []);

  async function handlePay(plan: string) {
    const response = await fetch("/api/chatview/subscription/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus(data?.error || "Failed to start checkout");
      return;
    }

    if (data?.checkout_url) {
      window.open(data.checkout_url as string, "_self");
      return;
    }

    setStatus("Subscription initiated.");
  }

  return (
    <PageShell activePath="/account">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel float-up rounded-3xl p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Account</p>
          <h1 className="headline-glow mt-3 text-3xl font-bold">Welcome, {String(profile?.first_name ?? session?.user?.name ?? "Coder")}</h1>
          <p className="mt-3 text-sm text-(--muted)">{status}</p>

          <div className="mt-6 feature-card">
            <p className="text-sm text-(--muted)">Email</p>
            <p className="font-semibold">{String(profile?.email ?? session?.user?.email ?? "-")}</p>
          </div>

          <div className="mt-4 feature-card">
            <p className="text-sm text-(--muted)">Current subscription</p>
            <p className="font-semibold">
              {String(
                (subscription?.plan as { display_name?: string; name?: string } | undefined)?.display_name ??
                  (subscription?.plan as { display_name?: string; name?: string } | undefined)?.name ??
                  ((profile?.subscription as { plan?: { display_name?: string } } | undefined)?.plan?.display_name ?? "Free"),
              )}
            </p>
            <p className="mt-1 text-sm text-(--muted)">
              Status: {(subscription?.status as string | undefined) || (profile?.subscription as { active?: boolean } | undefined)?.active ? "active" : "inactive"}
            </p>
          </div>
        </section>

        <section className="glass-panel float-up fade-delay-1 rounded-3xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Subscription & Payment</p>
          <h2 className="mt-2 text-2xl font-semibold">Choose a plan</h2>

          <div className="mt-5 space-y-3">
            {plans.length === 0 ? (
              <p className="text-sm text-(--muted)">No plans loaded yet.</p>
            ) : (
              plans.map((plan) => (
                <article key={plan.id} className="feature-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{plan.display_name || plan.name}</p>
                      <p className="text-sm text-(--muted)">{plan.description || "Subscription plan"}</p>
                    </div>
                    <p className="text-lg font-bold">{plan.price ? `$${plan.price}` : "-"}</p>
                  </div>
                  <button
                    className="mt-4 w-full rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-black"
                    onClick={() => handlePay(plan.name)}
                  >
                    Pay / Subscribe
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
