"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { authFetch } from "@/lib/auth-fetch";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

const CATEGORIES = [
  { value: "account", label: "Account" },
  { value: "billing", label: "Billing & Subscription" },
  { value: "technical", label: "Technical Issue" },
  { value: "feature", label: "Feature Request" },
  { value: "other", label: "Other" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

export default function NewTicketPage() {
  const router = useRouter();
  const accessToken = useAuthCredentialsStore((s) => s.accessToken);
  const isAuthed = Boolean(accessToken);

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("technical");
  const [priority, setPriority] = useState("normal");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fetcher = isAuthed ? authFetch : fetch;
      const res = await fetcher("/api/chatview/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, category, priority, email, name, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit ticket");
      }
      if (isAuthed && data?.id) {
        router.push(`/support/tickets/${data.id}`);
      } else {
        router.push(`/support/submitted?number=${encodeURIComponent(data?.number ?? "")}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit ticket");
      setSubmitting(false);
    }
  }

  return (
    <PageShell activePath="/support">
      <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">Support</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-4xl">Open a support ticket</h1>
        <p className="mt-3 max-w-2xl text-sm text-(--muted)">
          Tell us what&apos;s going on. We typically respond within one business day. If you&apos;re signed in,
          your ticket will be linked to your account and you&apos;ll be able to track replies at{" "}
          <Link href="/support/tickets" className="text-(--accent) hover:underline">My Tickets</Link>.
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4 max-w-2xl">
          {!isAuthed && (
            <>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-semibold">Your name</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border border-(--line) bg-(--panel) px-3 py-2 text-(--foreground) focus:border-(--accent) focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-semibold">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-(--line) bg-(--panel) px-3 py-2 text-(--foreground) focus:border-(--accent) focus:outline-none"
                />
              </label>
            </>
          )}

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">Subject</span>
            <input
              type="text"
              required
              maxLength={200}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-lg border border-(--line) bg-(--panel) px-3 py-2 text-(--foreground) focus:border-(--accent) focus:outline-none"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-(--line) bg-(--panel) px-3 py-2 text-(--foreground) focus:border-(--accent) focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="rounded-lg border border-(--line) bg-(--panel) px-3 py-2 text-(--foreground) focus:border-(--accent) focus:outline-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">Describe the issue</span>
            <textarea
              required
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Include steps to reproduce, error messages, and anything else that might help us help you."
              className="rounded-lg border border-(--line) bg-(--panel) px-3 py-2 text-(--foreground) focus:border-(--accent) focus:outline-none font-mono text-sm"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-5 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit ticket"}
            </button>
            <Link href="/support" className="text-sm text-(--muted) hover:text-(--foreground)">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </PageShell>
  );
}
