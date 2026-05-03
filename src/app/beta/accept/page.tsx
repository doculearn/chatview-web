"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { BetaAgreementText } from "@/components/beta-agreement";

type Signup = {
  firstname: string;
  lastname: string;
  email: string;
  status: "pending" | "accepted" | "revoked";
  agreement_version: string;
  accepted_at: string | null;
};

function BetaAcceptInner() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signup, setSignup] = useState<Signup | null>(null);

  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [playUrl, setPlayUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Missing or invalid link.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const r = await fetch(`/api/chatview/beta/lookup?token=${encodeURIComponent(token)}`);
        const data = await r.json().catch(() => null);
        if (!r.ok) {
          setError(data?.error || data?.detail || "This link is invalid or has expired.");
          return;
        }
        setSignup(data.signup as Signup);
        if ((data.signup as Signup).status === "accepted") {
          setAccepted(true);
        }
      } catch {
        setError("Could not load your invitation. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  async function handleAccept() {
    if (!agreed) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const r = await fetch("/api/chatview/beta/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) {
        setSubmitError(data?.error || data?.detail || "Acceptance failed.");
        return;
      }
      setAccepted(true);
      if (typeof data?.play_opt_in_url === "string") setPlayUrl(data.play_opt_in_url);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell activePath="/beta/accept">
      <section className="glass-panel float-up mx-auto w-full max-w-3xl rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Closed Beta Agreement</p>
        <h1 className="headline-glow mt-3 text-xl font-bold sm:text-3xl">
          Review &amp; accept to get tester access
        </h1>

        {loading ? (
          <p className="mt-6 text-sm text-(--muted)">Loading your invitation…</p>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : accepted ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-(--line) bg-(--panel-soft) p-4 text-sm">
              <p className="font-semibold text-(--success)">You&apos;re in, {signup?.firstname}!</p>
              <p className="mt-2 text-(--muted)">
                Thanks for accepting the Closed Beta Agreement. We&apos;ve emailed you the
                Google Play tester link. You can also open it directly below.
              </p>
            </div>
            {playUrl ? (
              <a
                href={playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl bg-(--accent) px-4 py-3 text-center text-sm font-semibold text-black"
              >
                Open Google Play tester opt-in
              </a>
            ) : null}
            <p className="text-xs text-(--muted)">
              Open the link above on the Android device where you&apos;ll install ChatView,
              sign in with the Google account you registered with, and tap{" "}
              <strong>Become a tester</strong>.
            </p>
          </div>
        ) : (
          <>
            {signup ? (
              <p className="mt-2 text-sm text-(--muted)">
                Hi {signup.firstname}, please review the agreement below before accepting.
              </p>
            ) : null}

            <div className="mt-6 max-h-[420px] overflow-y-auto rounded-xl border border-(--line) bg-(--panel-soft) p-4 sm:p-6">
              <BetaAgreementText />
            </div>

            <label className="mt-4 flex items-start gap-2 text-sm text-(--muted)">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
              />
              <span>
                I have read and agree to the ChatView Closed Beta Agreement
                {signup ? ` (v${signup.agreement_version})` : ""}.
              </span>
            </label>

            <button
              type="button"
              onClick={handleAccept}
              disabled={!agreed || submitting}
              className="mt-4 w-full rounded-xl bg-(--accent) px-4 py-3 text-sm font-semibold text-black disabled:opacity-70"
            >
              {submitting ? "Submitting…" : "I Agree — Send Me the Tester Link"}
            </button>

            {submitError ? <p className="mt-3 text-sm text-red-400">{submitError}</p> : null}
          </>
        )}
      </section>
    </PageShell>
  );
}

export default function BetaAcceptPage() {
  return (
    <Suspense fallback={null}>
      <BetaAcceptInner />
    </Suspense>
  );
}
