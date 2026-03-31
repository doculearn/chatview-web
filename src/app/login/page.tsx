"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { PageShell } from "@/components/page-shell";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentialsLogin(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      login,
      password,
      redirect: false,
      callbackUrl: "/account",
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid credentials. Please try again.");
      return;
    }

    window.location.href = "/account";
  }

  return (
    <PageShell activePath="/login">
      <section className="glass-panel float-up mx-auto w-full max-w-xl rounded-3xl p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Login</p>
        <h1 className="headline-glow mt-3 text-3xl font-bold">Sign in to ChatView</h1>
        <p className="mt-3 text-sm text-(--muted)">Use your ChatView account or Azure B2C sign-in.</p>

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

        <button
          type="button"
          onClick={() => signIn("azure-ad-b2c", { callbackUrl: "/account" })}
          className="mt-3 w-full rounded-xl border border-(--line) bg-(--panel-soft) px-4 py-3 text-sm font-semibold"
        >
          Sign in with Azure B2C
        </button>

        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      </section>
    </PageShell>
  );
}
