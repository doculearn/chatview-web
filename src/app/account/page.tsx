"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { UsageStats } from "@/components/usage/UsageStats";
import { DataDeletionRequest } from "@/components/account/DataDeletionRequest";
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
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Account info */}
        <section className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Account</p>
          <h1 className="headline-glow mt-2 text-lg font-bold sm:mt-3 sm:text-2xl lg:text-3xl break-words">Welcome, {String(profile?.first_name ?? firstname ?? "Coder")}</h1>
          <p className="mt-2 text-xs text-(--muted) sm:mt-3 sm:text-sm">{status}</p>

          <div className="mt-4 feature-card sm:mt-6">
            <p className="text-xs text-(--muted) sm:text-sm">Email</p>
            <p className="text-sm font-semibold break-all sm:text-base">{String(profile?.email ?? email ?? "-")}</p>
          </div>
        </section>

        {/* Subscription */}
        <SubscriptionManager />

        {/* Usage */}
        <UsageStats />

        {/* Data deletion request */}
        <DataDeletionRequest />

        {/* Delete account */}
        <section className="glass-panel rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Danger zone</p>
          <h2 className="mt-2 text-lg font-bold text-red-400 sm:text-xl">Delete Account</h2>
          <p className="mt-2 text-xs text-(--muted) sm:text-sm">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Link
            href="/delete-account"
            className="mt-4 inline-block rounded-lg border border-red-500/30 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-500/10"
          >
            Delete Account
          </Link>
        </section>
      </div>
    </PageShell>
  );
}
