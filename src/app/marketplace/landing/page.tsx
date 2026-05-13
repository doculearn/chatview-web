"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { authFetch } from "@/lib/auth-fetch";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

type ResolveResult = {
  id: string;
  msft_subscription_id: string;
  plan_id: string;
  quantity: number;
  status: string;
  beneficiary_email: string;
  internal_plan_name: string;
};

function LandingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const accessToken = useAuthCredentialsStore((s) => s.accessToken);
  const isAuthed = Boolean(accessToken);

  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [result, setResult] = useState<ResolveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    if (!isAuthed) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await authFetch("/api/chatview/marketplace/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to resolve subscription");
        if (!cancelled) setResult(data as ResolveResult);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to resolve subscription");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, isAuthed]);

  async function onActivate() {
    if (!result) return;
    setActivating(true);
    setError(null);
    try {
      const res = await authFetch(
        `/api/chatview/marketplace/activate/${encodeURIComponent(result.msft_subscription_id)}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to activate subscription");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate subscription");
    } finally {
      setActivating(false);
    }
  }

  if (!token) {
    return (
      <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">Microsoft Marketplace</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-4xl">Missing purchase token</h1>
        <p className="mt-3 max-w-2xl text-sm text-(--muted)">
          This page is reached from the Microsoft Commercial Marketplace after a purchase. If you arrived
          here directly, please complete the purchase from Microsoft AppSource or Azure Marketplace.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/pricing" className="rounded-xl bg-(--accent) px-5 py-3 font-semibold text-black">
            View plans
          </Link>
          <Link href="/support" className="text-sm text-(--muted) hover:text-(--foreground) self-center">
            Need help?
          </Link>
        </div>
      </section>
    );
  }

  if (!isAuthed) {
    const next = `/marketplace/landing?token=${encodeURIComponent(token)}`;
    return (
      <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">Microsoft Marketplace</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-4xl">Sign in to activate your subscription</h1>
        <p className="mt-3 max-w-2xl text-sm text-(--muted)">
          Microsoft has confirmed your purchase. Sign in or create a ChatView account using the same
          email as the beneficiary you specified at checkout. We&apos;ll link your subscription right
          after sign-in.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="rounded-xl bg-(--accent) px-5 py-3 font-semibold text-black"
          >
            Sign in
          </Link>
          <Link
            href={`/register?next=${encodeURIComponent(next)}`}
            className="rounded-xl border border-(--line) bg-(--panel) px-5 py-3 font-semibold text-(--foreground)"
          >
            Create account
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
      <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">Microsoft Marketplace</p>
      <h1 className="mt-3 text-2xl font-bold sm:text-4xl">Activate your ChatView subscription</h1>
      <p className="mt-3 max-w-2xl text-sm text-(--muted)">
        Thanks for purchasing ChatView through Microsoft. Confirm the details below to finish
        activation — Microsoft will continue to handle billing, and your matching ChatView plan will
        be enabled immediately.
      </p>

      {loading && (
        <p className="mt-6 text-sm text-(--muted)">Resolving your purchase…</p>
      )}

      {error && (
        <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {result && !done && (
        <div className="mt-8 grid gap-6 max-w-2xl">
          <dl className="grid gap-3 rounded-2xl border border-(--line) bg-(--panel) p-5 text-sm">
            <Row label="Plan" value={result.internal_plan_name || result.plan_id || "—"} />
            <Row label="Microsoft plan id" value={result.plan_id || "—"} mono />
            <Row label="Seats" value={String(result.quantity || 1)} />
            <Row label="Beneficiary" value={result.beneficiary_email || "—"} />
            <Row label="Status" value={result.status} />
          </dl>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onActivate}
              disabled={activating}
              className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-5 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
            >
              {activating ? "Activating…" : "Activate subscription"}
            </button>
            <Link href="/support" className="text-sm text-(--muted) hover:text-(--foreground)">
              Something looks wrong?
            </Link>
          </div>
        </div>
      )}

      {done && (
        <div className="mt-8 max-w-2xl rounded-2xl border border-(--accent)/40 bg-(--accent)/10 p-5">
          <h2 className="text-lg font-semibold">You&apos;re all set</h2>
          <p className="mt-2 text-sm text-(--muted)">
            Your ChatView subscription is active. Open the app to start coding from your phone.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push("/account")}
              className="rounded-xl bg-(--accent) px-5 py-3 font-semibold text-black"
            >
              Go to my account
            </button>
            <Link
              href="/download"
              className="rounded-xl border border-(--line) bg-(--panel) px-5 py-3 font-semibold text-(--foreground)"
            >
              Get the mobile app
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <dt className="text-(--muted)">{label}</dt>
      <dd className={mono ? "font-mono text-xs" : "font-semibold"}>{value}</dd>
    </div>
  );
}

export default function MarketplaceLandingPage() {
  return (
    <PageShell activePath="/marketplace/landing">
      <Suspense fallback={null}>
        <LandingInner />
      </Suspense>
    </PageShell>
  );
}
