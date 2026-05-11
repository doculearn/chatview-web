"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { authFetch } from "@/lib/auth-fetch";
import { performLogout } from "@/lib/logout";

type Pat = {
  id: string | number;
  name: string;
  last_four: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
};

type CreatedPat = Pat & { token: string; warning?: string };

function fmt(date: string | null) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleString();
  } catch {
    return date;
  }
}

export default function DeveloperSettingsPage() {
  const [pats, setPats] = useState<Pat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form
  const [name, setName] = useState("");
  const [lifetimeDays, setLifetimeDays] = useState<string>("");
  const [creating, setCreating] = useState(false);

  // Reveal-once modal
  const [revealed, setRevealed] = useState<CreatedPat | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/chatview/account/pats");
      if (res.status === 401) {
        performLogout();
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError((data && (data.error as string)) || "Failed to load tokens");
        setPats([]);
      } else if (Array.isArray(data)) {
        setPats(data as Pat[]);
      } else {
        setPats([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tokens");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { name: name.trim() };
      const days = Number.parseInt(lifetimeDays, 10);
      if (Number.isFinite(days) && days > 0) body.lifetime_days = days;

      const res = await authFetch("/api/chatview/account/pats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.token) {
        setError((data && (data.error as string)) || "Failed to create token");
        return;
      }
      setRevealed(data as CreatedPat);
      setName("");
      setLifetimeDays("");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create token");
    } finally {
      setCreating(false);
    }
  }

  async function onRevoke(id: string | number) {
    if (!confirm("Revoke this token? Any tools using it will stop working immediately.")) return;
    setError(null);
    try {
      const res = await authFetch(`/api/chatview/account/pats/${encodeURIComponent(String(id))}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => null);
        setError((data && (data.error as string)) || "Failed to revoke token");
        return;
      }
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to revoke token");
    }
  }

  async function copyToken() {
    if (!revealed?.token) return;
    try {
      await navigator.clipboard.writeText(revealed.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <PageShell>
      <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-(--accent-2)">Developer settings</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Personal Access Tokens</h1>
            <p className="mt-2 max-w-2xl text-sm text-(--muted)">
              Long-lived API tokens for headless tools — the ChatView MCP server, CI scripts, custom integrations.
              Treat them like passwords. Revoke anything you no longer use.
            </p>
          </div>
          <Link href="/account" className="text-sm font-semibold text-(--accent-2) underline-offset-4 hover:underline">
            ← Back to account
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Create form */}
        <form
          onSubmit={onCreate}
          className="mt-8 grid gap-4 rounded-2xl border border-(--line) bg-(--panel-soft) p-5 sm:grid-cols-[2fr_1fr_auto] sm:items-end"
        >
          <label className="block text-sm">
            <span className="font-semibold">Token name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Claude Desktop on MacBook"
              className="mt-1 w-full rounded-xl border border-(--line) bg-black/20 px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--accent)"
              maxLength={100}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Expires in (days)</span>
            <input
              type="number"
              min={1}
              max={3650}
              value={lifetimeDays}
              onChange={(e) => setLifetimeDays(e.target.value)}
              placeholder="never"
              className="mt-1 w-full rounded-xl border border-(--line) bg-black/20 px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--accent)"
            />
          </label>
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="inline-flex h-[42px] items-center justify-center rounded-xl bg-(--accent) px-5 font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? "Generating…" : "Generate token"}
          </button>
        </form>

        {/* List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Active tokens</h2>
          {loading ? (
            <p className="mt-3 text-sm text-(--muted)">Loading…</p>
          ) : pats.length === 0 ? (
            <p className="mt-3 text-sm text-(--muted)">You haven&rsquo;t generated any tokens yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5 overflow-hidden rounded-2xl border border-(--line)">
              {pats.map((p) => (
                <li key={String(p.id)} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="mt-1 font-mono text-xs text-(--muted)">
                      cv_pat_…{p.last_four} · created {fmt(p.created_at)} · last used {fmt(p.last_used_at)}
                      {p.expires_at ? ` · expires ${fmt(p.expires_at)}` : " · never expires"}
                    </p>
                  </div>
                  <button
                    onClick={() => onRevoke(p.id)}
                    className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:border-red-400/60 hover:bg-red-500/20"
                  >
                    Revoke
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* MCP install hint */}
        <div className="mt-8 rounded-2xl border border-(--accent)/30 bg-(--accent)/5 p-5 text-sm">
          <p className="font-semibold text-(--accent)">Use with the ChatView MCP server</p>
          <p className="mt-2 text-(--muted)">
            Install <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">@doculearn/chatview-mcp</code> in
            Claude Desktop, Cursor, or Windsurf, and paste your token into the <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">CHATVIEW_TOKEN</code> env var.
          </p>
        </div>
      </section>

      {/* Reveal-once modal */}
      {revealed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-(--line) bg-(--panel) p-6 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-(--accent-2)">Token created</p>
            <h3 className="mt-1 text-xl font-semibold">{revealed.name}</h3>
            <p className="mt-3 text-sm text-(--muted)">
              <strong className="text-(--foreground)">Copy this token now.</strong> You won&rsquo;t be able to see it again.
            </p>
            <div className="mt-4 flex items-stretch gap-2">
              <code className="flex-1 truncate rounded-xl border border-(--line) bg-black/30 px-3 py-3 font-mono text-sm">
                {revealed.token}
              </code>
              <button
                onClick={copyToken}
                className="rounded-xl bg-(--accent) px-4 font-semibold text-black transition hover:brightness-110"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setRevealed(null)}
                className="rounded-xl border border-(--line) bg-(--panel-soft) px-4 py-2 text-sm font-semibold transition hover:border-(--accent)"
              >
                I&rsquo;ve saved it — close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
