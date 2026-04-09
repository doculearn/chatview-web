"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

export default function LoginPage() {
  const router = useRouter();
  const setCredentials = useAuthCredentialsStore((state) => state.setCredentials);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentialsLogin(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/chatview/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    const result = (await response.json().catch(() => null)) as
      | {
          user?: Record<string, unknown>;
          tokens?: Record<string, unknown>;
          session_id?: string;
          error?: string;
          detail?: string;
        }
      | null;

    setLoading(false);

    if (!response.ok || !result?.tokens?.access_token) {
      setError(result?.error || result?.detail || "Invalid credentials. Please try again.");
      return;
    }

    setCredentials({
      accessToken: String(result.tokens.access_token),
      refreshToken: typeof result.tokens.refresh_token === "string" ? result.tokens.refresh_token : null,
      sessionId: typeof result.session_id === "string" ? result.session_id : null,
      username: typeof result.user?.username === "string" ? result.user.username : null,
      firstname: typeof result.user?.firstname === "string" ? result.user.firstname : null,
      lastname: typeof result.user?.lastname === "string" ? result.user.lastname : null,
      email: typeof result.user?.email === "string" ? result.user.email : null,
    });

    router.push("/account");
  }

  return (
    <PageShell activePath="/login">
      <section className="glass-panel float-up mx-auto w-full max-w-xl rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Login</p>
        <h1 className="headline-glow mt-3 text-xl font-bold sm:text-3xl">Sign in to ChatView</h1>
        <p className="mt-3 text-sm text-(--muted)">Use your ChatView account credentials.</p>

        <form className="mt-6 space-y-4" onSubmit={handleCredentialsLogin}>
          <input
            className="w-full rounded-xl border border-(--line) bg-(--panel-soft) px-4 py-3 text-sm outline-none focus:border-(--accent)"
            placeholder="Email or username"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-(--line) bg-(--panel-soft) px-4 py-3 text-sm outline-none focus:border-(--accent)"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-(--accent) px-4 py-3 text-sm font-semibold text-black disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in with ChatView credentials"}
          </button>
        </form>

        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      </section>
    </PageShell>
  );
}
