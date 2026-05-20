"use client";

import { FormEvent, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { track } from "@/lib/cv-analytics";

export default function BetaSignupPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [useCase, setUseCase] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!agreed) {
      setError("Please confirm you'll review the agreement before we email it to you.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chatview/beta/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          email: email.trim(),
          country: country.trim(),
          use_case: useCase.trim(),
          website,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || data?.detail || "Could not submit your request.");
        return;
      }
      track("beta_signup_completed", { country: country.trim() || "" });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell activePath="/beta-signup">
      <section className="glass-panel float-up mx-auto w-full max-w-xl rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Closed Beta</p>
        <h1 className="headline-glow mt-3 text-xl font-bold sm:text-3xl">
          Join the ChatView mobile beta
        </h1>
        <p className="mt-2 text-sm text-(--muted)">
          Tell us a bit about yourself. We&apos;ll email you our short Closed Beta agreement;
          once you accept, you&apos;ll get the Google Play tester invite.
        </p>

        {success ? (
          <div className="mt-6 rounded-xl border border-(--line) bg-(--panel-soft) p-4 text-sm">
            <p className="font-semibold text-(--success)">Thanks — check your inbox!</p>
            <p className="mt-2 text-(--muted)">
              We&apos;ve sent the Closed Beta agreement to <strong>{email}</strong>. Open it,
              review the terms, and tap <em>Review &amp; Accept</em>. As soon as you accept,
              we&apos;ll email you the Google Play tester link.
            </p>
            <p className="mt-2 text-xs text-(--muted)">
              Don&apos;t see it? Check spam, then{" "}
              <button
                type="button"
                className="underline underline-offset-4"
                onClick={() => setSuccess(false)}
              >
                resubmit
              </button>
              .
            </p>
          </div>
        ) : (
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
              type="email"
              placeholder="Email (the one you'll use on Google Play)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-(--line) bg-(--panel-soft) px-4 py-3 text-sm outline-none focus:border-(--accent)"
              placeholder="Country (optional)"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <textarea
              className="w-full rounded-xl border border-(--line) bg-(--panel-soft) px-4 py-3 text-sm outline-none focus:border-(--accent) min-h-[100px]"
              placeholder="How do you plan to use ChatView? (optional)"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              maxLength={2000}
            />
            {/* Honeypot — hidden from users, bots will fill it */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <label className="flex items-start gap-2 text-sm text-(--muted)">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
                required
              />
              <span>
                I understand I&apos;ll receive a Closed Beta agreement by email and that I must
                accept it before I&apos;m granted tester access.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full rounded-xl bg-(--accent) px-4 py-3 text-sm font-semibold text-black disabled:opacity-70"
            >
              {loading ? "Sending..." : "Email me the agreement"}
            </button>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </form>
        )}
      </section>
    </PageShell>
  );
}
