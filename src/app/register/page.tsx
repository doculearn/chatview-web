"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { GoogleLoginButton } from "@/components/google-login-button";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";
import { track } from "@/lib/cv-analytics";

export default function RegisterPage() {
  const router = useRouter();
  const setCredentials = useAuthCredentialsStore((state) => state.setCredentials);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fire once when the registration form is first seen — lets us
  // measure step-1 of the signup funnel (page reached → form submitted
  // → account created).
  useEffect(() => {
    track("signup_started");
  }, []);

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
      track("signup_failed", { reason: data?.error || data?.detail || "unknown" });
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
      track("signup_completed", { method: "email" });
      router.push("/pricing");
      return;
    }

    track("signup_completed", { method: "email", needs_login: true });
    setMessage("Registration successful. You can now log in.");
  }

  return (
    <PageShell activePath="/register">
      <section className="glass-panel float-up mx-auto w-full max-w-xl rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Register</p>
        <h1 className="headline-glow mt-3 text-xl font-bold sm:text-3xl">Create your ChatView account</h1>

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
          <div className="relative">
            <input
              className="w-full rounded-xl border border-(--line) bg-(--panel-soft) px-4 py-3 pr-11 text-sm outline-none focus:border-(--accent)"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted) hover:text-(--foreground) transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-(--accent) px-4 py-3 text-sm font-semibold text-black disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-(--line)" />
          <span className="text-xs uppercase tracking-[0.24em] text-(--muted)">or</span>
          <div className="h-px flex-1 bg-(--line)" />
        </div>

        <GoogleLoginButton label="Sign up with Google" disabled={loading} />

        {message ? <p className="mt-3 text-sm text-(--success)">{message}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      </section>
    </PageShell>
  );
}
