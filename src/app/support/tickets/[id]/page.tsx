"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { authFetch } from "@/lib/auth-fetch";
import { useAuthReady } from "@/hooks/use-auth-ready";

type TicketMessage = {
  id: string;
  author_name: string;
  author_email: string;
  body: string;
  is_from_staff: boolean;
  is_internal_note: boolean;
  created_at: string;
};

type TicketDetail = {
  id: string;
  number: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  messages: TicketMessage[];
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  waiting_customer: "Awaiting You",
  resolved: "Resolved",
  closed: "Closed",
};

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const authReady = useAuthReady();

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [posting, setPosting] = useState(false);

  async function load() {
    try {
      const res = await authFetch(`/api/chatview/support/tickets/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load ticket");
      setTicket(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ticket");
    }
  }

  useEffect(() => {
    if (!authReady || !id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, id]);

  async function postReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reply.trim()) return;
    setPosting(true);
    setError(null);
    try {
      const res = await authFetch(`/api/chatview/support/tickets/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: reply }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to post reply");
      setTicket(data);
      setReply("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reply");
    } finally {
      setPosting(false);
    }
  }

  return (
    <PageShell activePath="/support">
      <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
        <Link href="/support/tickets" className="text-xs uppercase tracking-[0.24em] text-(--muted) hover:text-(--foreground)">
          ← All tickets
        </Link>

        {error && !ticket && (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
        )}

        {!ticket && !error && <p className="mt-6 text-sm text-(--muted)">Loading…</p>}

        {ticket && (
          <>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-(--muted)">{ticket.number}</p>
                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{ticket.subject}</h1>
                <p className="mt-2 text-xs text-(--muted)">
                  Opened {new Date(ticket.created_at).toLocaleString()} · Status:{" "}
                  <span className="font-semibold text-(--foreground)">
                    {STATUS_LABELS[ticket.status] ?? ticket.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {ticket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-2xl border p-4 ${
                    m.is_from_staff
                      ? "border-(--accent)/30 bg-(--accent)/5"
                      : "border-(--line) bg-(--panel-soft)"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-(--muted)">
                    <span className="font-semibold text-(--foreground)">
                      {m.is_from_staff ? "ChatView Support" : m.author_name || "You"}
                    </span>
                    <span>{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-(--foreground)">{m.body}</p>
                </div>
              ))}
            </div>

            {ticket.status !== "closed" && (
              <form onSubmit={postReply} className="mt-6 space-y-3">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold">Add a reply</span>
                  <textarea
                    rows={5}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="rounded-lg border border-(--line) bg-(--panel) px-3 py-2 text-sm text-(--foreground) focus:border-(--accent) focus:outline-none font-mono"
                    placeholder="Share more details or follow up…"
                  />
                </label>
                {error && (
                  <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={posting || !reply.trim()}
                  className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
                >
                  {posting ? "Sending…" : "Send reply"}
                </button>
              </form>
            )}

            {ticket.status === "closed" && (
              <p className="mt-6 rounded-lg border border-(--line) bg-(--panel-soft) px-3 py-2 text-sm text-(--muted)">
                This ticket is closed. <Link href="/support/new" className="text-(--accent) hover:underline">Open a new ticket</Link> if you need more help.
              </p>
            )}
          </>
        )}
      </section>
    </PageShell>
  );
}
