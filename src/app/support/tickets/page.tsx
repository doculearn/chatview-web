"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { authFetch } from "@/lib/auth-fetch";
import { useAuthReady } from "@/hooks/use-auth-ready";

type TicketSummary = {
  id: string;
  number: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  open: "border-(--accent)/40 bg-(--accent)/10 text-(--accent)",
  in_progress: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
  waiting_customer: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  resolved: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  closed: "border-(--line) bg-(--panel-soft) text-(--muted)",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  waiting_customer: "Awaiting You",
  resolved: "Resolved",
  closed: "Closed",
};

export default function MyTicketsPage() {
  const authReady = useAuthReady();
  const [tickets, setTickets] = useState<TicketSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authReady) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch("/api/chatview/support/tickets");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load tickets");
        if (!cancelled) setTickets(data.results ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load tickets");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady]);

  return (
    <PageShell activePath="/support">
      <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">Support</p>
            <h1 className="mt-3 text-2xl font-bold sm:text-4xl">My tickets</h1>
          </div>
          <Link
            href="/support/new"
            className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
          >
            New ticket
          </Link>
        </div>

        <div className="mt-6">
          {!authReady && <p className="text-sm text-(--muted)">Loading…</p>}
          {authReady && error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
          )}
          {authReady && !error && tickets !== null && tickets.length === 0 && (
            <div className="rounded-2xl border border-(--line) bg-(--panel-soft) p-6 text-center">
              <p className="text-sm text-(--muted)">You don&apos;t have any tickets yet.</p>
              <Link
                href="/support/new"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
              >
                Open your first ticket
              </Link>
            </div>
          )}
          {authReady && !error && tickets && tickets.length > 0 && (
            <ul className="divide-y divide-(--line) rounded-2xl border border-(--line) bg-(--panel-soft) overflow-hidden">
              {tickets.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/support/tickets/${t.id}`}
                    className="flex flex-col gap-2 px-4 py-4 hover:bg-(--panel) sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-(--muted)">{t.number}</p>
                      <p className="mt-1 truncate font-semibold">{t.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`rounded-full border px-2.5 py-1 font-semibold uppercase tracking-[0.16em] ${STATUS_STYLES[t.status] ?? STATUS_STYLES.closed}`}
                      >
                        {STATUS_LABELS[t.status] ?? t.status}
                      </span>
                      <span className="text-(--muted)">
                        {new Date(t.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageShell>
  );
}
