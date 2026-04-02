"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { performLogout } from "@/lib/logout";
import { authFetch } from "@/lib/auth-fetch";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

export default function AccountPage() {
  const router = useRouter();
  const firstname = useAuthCredentialsStore((state) => state.firstname);
  const email = useAuthCredentialsStore((state) => state.email);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<string>("Loading account...");

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
        <section className="glass-panel float-up rounded-3xl p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Account</p>
          <h1 className="headline-glow mt-3 text-3xl font-bold">Welcome, {String(profile?.first_name ?? firstname ?? "Coder")}</h1>
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
    </PageShell>
  );
}
