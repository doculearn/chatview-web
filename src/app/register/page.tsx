"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

export default function RegisterPage() {
  const router = useRouter();
  const setCredentials = useAuthCredentialsStore((state) => state.setCredentials);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/chatview/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        email,
        password,
        agreeToTerms: true,
        subscription_tier: "free",
      }),
    });

    const data = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(data?.error || data?.detail || "Registration failed");
      return;
    }

    const accessToken = typeof data?.tokens?.access_token === "string" ? data.tokens.access_token : null;

    if (accessToken) {
      setCredentials({
        accessToken,
        refreshToken: typeof data?.tokens?.refresh_token === "string" ? data.tokens.refresh_token : null,
        sessionId: typeof data?.session_id === "string" ? data.session_id : null,
        username,
        firstname,
        lastname,
        email,
      });
      router.push("/account");
      return;
    }

    setMessage("Registration successful. You can now log in.");
  }

  return (
    <PageShell activePath="/register">
      <section className="glass-panel float-up mx-auto w-full max-w-xl rounded-3xl p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Register</p>
        <h1 className="headline-glow mt-3 text-3xl font-bold">Create your ChatView account</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-xl border border-(--line) bg-(--panel-soft) px-4 py-3 text-sm outline-none focus:border-(--accent)"
              placeholder="First name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
            <input
              className="rounded-xl border border-(--line) bg-(--panel-soft) px-4 py-3 text-sm outline-none focus:border-(--accent)"
              placeholder="Last name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
          <input
            className="w-full rounded-xl border border-(--line) bg-(--panel-soft) px-4 py-3 text-sm outline-none focus:border-(--accent)"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-(--line) bg-(--panel-soft) px-4 py-3 text-sm outline-none focus:border-(--accent)"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {message ? <p className="mt-3 text-sm text-(--success)">{message}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      </section>
    </PageShell>
  );
}
