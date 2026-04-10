"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { UsageStats } from "@/components/usage/UsageStats";
import { performLogout } from "@/lib/logout";
import { authFetch } from "@/lib/auth-fetch";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstname = useAuthCredentialsStore((state) => state.firstname);
  const email = useAuthCredentialsStore((state) => state.email);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<string>("Loading account...");

  // Handle return from Dodo Payments checkout
  useEffect(() => {
    const subscriptionCompleted = searchParams?.get("subscription_completed");

    if (subscriptionCompleted === "true") {
      router.replace("/subscription/return?status=success");
      return;
    }

    const checkout = searchParams?.get("checkout");
    if (checkout === "sub_pending") {
      // Pending subscription without Dodo — stay on account page
      // SubscriptionManager will show the "Complete Payment" button
      return;
    }
  }, [searchParams, router]);

  useEffect(() => {
    async function load() {
      try {
        const profileRes = await authFetch("/api/chatview/account");
        const profileData = await profileRes.json().catch(() => null);

        if (profileRes.ok) {
          setProfile(profileData);
          setStatus("Account loaded");
        } else if (profileRes.status === 401) {
          performLogout();
        } else {
          setStatus("Failed to load account data");
        }
      } catch {
        setStatus("Error loading account information");
      }
    }

    load();
  }, [router]);

  return (
    <PageShell activePath="/account">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Account</p>
          <h1 className="headline-glow mt-3 text-xl font-bold sm:text-3xl">Welcome, {String(profile?.first_name ?? firstname ?? "Coder")}</h1>
          <p className="mt-3 text-sm text-(--muted)">{status}</p>

          <div className="mt-6 feature-card">
            <p className="text-sm text-(--muted)">Email</p>
            <p className="font-semibold">{String(profile?.email ?? email ?? "-")}</p>
          </div>
        </section>

        <section className="lg:hidden">
          <SubscriptionManager />
        </section>
      </div>

      <div className="mt-6 hidden lg:block">
        <SubscriptionManager />
      </div>

      <div className="mt-6">
        <UsageStats />
      </div>
    </PageShell>
  );
}
