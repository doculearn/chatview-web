"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

function OAuthSuccessInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setCredentials = useAuthCredentialsStore((state) => state.setCredentials);
  const [error, setError] = useState<string | null>(null);
  const consumedRef = useRef(false);

  useEffect(() => {
    if (consumedRef.current) return;
    consumedRef.current = true;

    const sessionKey = searchParams.get("session");
    if (!sessionKey) {
      setError("Missing session key in OAuth callback.");
      return;
    }

    (async () => {
      try {
        const response = await fetch("/api/chatview/auth/oauth-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_key: sessionKey }),
        });
        const data = await response.json();
        if (!response.ok || !data?.success) {
          throw new Error(data?.error || "Failed to retrieve OAuth session.");
        }

        const userData = data.user_data ?? {};
        const tokens = data.tokens ?? {};

        setCredentials({
          accessToken: typeof tokens.access_token === "string" ? tokens.access_token : null,
          refreshToken: typeof tokens.refresh_token === "string" ? tokens.refresh_token : null,
          sessionId: typeof userData.session_id === "string" ? userData.session_id : null,
          username: typeof userData.username === "string" ? userData.username : null,
          firstname:
            typeof userData.firstname === "string"
              ? userData.firstname
              : typeof userData.first_name === "string"
                ? userData.first_name
                : null,
          lastname:
            typeof userData.lastname === "string"
              ? userData.lastname
              : typeof userData.last_name === "string"
                ? userData.last_name
                : null,
          email: typeof userData.email === "string" ? userData.email : null,
        });

        const subscriptionActive = Boolean(
          userData.subscription_active ?? data.subscription_active,
        );
        router.replace(subscriptionActive ? "/account" : "/pricing");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign-in failed.");
      }
    })();
  }, [router, searchParams, setCredentials]);

  return (
    <PageShell activePath="/login">
      <section className="glass-panel float-up mx-auto w-full max-w-xl rounded-2xl p-6 sm:rounded-3xl sm:p-10 text-center">
        {error ? (
          <>
            <h1 className="headline-glow text-xl font-bold sm:text-2xl">Sign-in failed</h1>
            <p className="mt-4 text-sm text-red-400">{error}</p>
            <a
              href="/login"
              className="mt-6 inline-block rounded-xl border border-(--line) px-4 py-2 text-sm hover:border-(--accent)">
              Back to login
            </a>
          </>
        ) : (
          <>
            <h1 className="headline-glow text-xl font-bold sm:text-2xl">Signing you in…</h1>
            <p className="mt-3 text-sm text-(--muted)">
              Finishing up your Google authentication.
            </p>
          </>
        )}
      </section>
    </PageShell>
  );
}

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OAuthSuccessInner />
    </Suspense>
  );
}
