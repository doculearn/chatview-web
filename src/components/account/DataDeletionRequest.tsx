"use client";

import { useState } from "react";
import { authFetch } from "@/lib/auth-fetch";

const DATA_TYPES = [
  {
    id: "usage_history",
    label: "Usage history",
    description: "Feature usage logs and interaction history.",
  },
  {
    id: "session_data",
    label: "Session data",
    description: "Relay and coding session metadata.",
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Diagnostics and performance analytics tied to your account.",
  },
  {
    id: "support_messages",
    label: "Support messages",
    description: "Messages and attachments sent to support.",
  },
] as const;

type DataTypeId = (typeof DATA_TYPES)[number]["id"];

export function DataDeletionRequest() {
  const [selected, setSelected] = useState<Set<DataTypeId>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function toggle(id: DataTypeId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setResult(null);
  }

  async function handleSubmit() {
    if (selected.size === 0) return;
    setSubmitting(true);
    setResult(null);

    try {
      const res = await authFetch("/api/chatview/account/data-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data_types: [...selected] }),
      });

      if (res.ok) {
        setResult({ ok: true, message: "Data deletion request submitted. We'll process it within 30 days." });
        setSelected(new Set());
      } else {
        const data = await res.json().catch(() => null);
        setResult({
          ok: false,
          message: (data as Record<string, string> | null)?.error ?? "Request failed. Please try again.",
        });
      }
    } catch {
      setResult({ ok: false, message: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="glass-panel rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
      <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Privacy</p>
      <h2 className="mt-2 text-lg font-bold sm:text-xl">Request Data Deletion</h2>
      <p className="mt-2 text-xs text-(--muted) sm:text-sm">
        Select the data categories you would like deleted. Your account will remain active.
      </p>

      <div className="mt-4 space-y-3">
        {DATA_TYPES.map((dt) => (
          <label
            key={dt.id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-(--line) p-3 transition-colors hover:bg-white/[0.03]"
          >
            <input
              type="checkbox"
              checked={selected.has(dt.id)}
              onChange={() => toggle(dt.id)}
              className="mt-0.5 accent-(--accent)"
            />
            <div>
              <p className="text-sm font-semibold">{dt.label}</p>
              <p className="text-xs text-(--muted)">{dt.description}</p>
            </div>
          </label>
        ))}
      </div>

      {result && (
        <p className={`mt-4 text-sm ${result.ok ? "text-green-400" : "text-red-400"}`}>
          {result.message}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={selected.size === 0 || submitting}
        className="mt-4 rounded-lg border border-(--line) px-5 py-2 text-xs font-semibold uppercase tracking-wider text-(--foreground) transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? "Submitting…" : "Submit Deletion Request"}
      </button>
    </section>
  );
}
