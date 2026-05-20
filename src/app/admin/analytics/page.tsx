"use client";

/**
 * Admin-only dashboard for the in-house ChatView Insights analytics.
 *
 * Renders the JSON returned by /api/chatview/analytics/dashboard with
 * plain Tailwind — no chart library dep. The bar charts are built from
 * width-percent <div>s so the page stays under a handful of KB and
 * renders instantly on mobile.
 *
 * Auth: the proxy route forwards the caller's JWT to Django, which
 * gates the upstream endpoint with IsAdminUser. Non-admin users get a
 * pass-through 401/403 and the page shows the auth-required state.
 */

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { authFetch } from "@/lib/auth-fetch";

// ── Types — mirrors the JSON shape DashboardView produces. ────────

type Totals = {
  pageviews: number;
  unique_visitors: number;
  sessions: number;
  events: number;
  window_days: number;
  since: string;
};

type DaySeries = { day: string; views: number; unique_visitors: number };
type PathRow = { path: string; views: number };
type RefRow = { referrer_host: string; views: number };
type UtmRow = { utm_source: string; views: number };
type DeviceRow = { device: string; views: number };
type CountryRow = { country: string; views: number };

type Dashboard = {
  site: string;
  totals: Totals;
  by_day: DaySeries[];
  top_paths: PathRow[];
  top_referrer_hosts: RefRow[];
  top_utm_sources: UtmRow[];
  device_split: DeviceRow[];
  country_split: CountryRow[];
};

type FunnelStep = {
  event: string;
  label: string;
  sessions: number;
  drop_off_from_prev: number | null;
  conversion_from_prev_pct: number | null;
};

type Funnel = {
  site: string;
  window_days: number;
  since: string;
  steps: FunnelStep[];
  overall_conversion_pct: number;
};

// ── UI helpers ────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums sm:text-3xl">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function BarRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-1/3 truncate text-sm" title={label}>
        {label}
      </div>
      <div className="relative flex-1">
        <div className="h-2 rounded-full bg-(--panel-soft)">
          <div
            className="h-2 rounded-full bg-(--accent)"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="w-16 text-right text-sm tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel rounded-2xl p-4 sm:p-6">
      <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────

const RANGE_OPTIONS = [1, 7, 30, 90] as const;

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<number>(7);

  const load = useCallback(async (windowDays: number) => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, funnelRes] = await Promise.all([
        authFetch(`/api/chatview/analytics/dashboard?days=${windowDays}`),
        authFetch(`/api/chatview/analytics/funnel?days=${windowDays}`),
      ]);

      if (dashRes.status === 401 || dashRes.status === 403) {
        setError("Admin access required.");
        setData(null);
        setFunnel(null);
        return;
      }
      if (!dashRes.ok) {
        const detail = await dashRes.json().catch(() => null);
        setError(detail?.error || "Failed to load analytics");
        setData(null);
        return;
      }
      setData((await dashRes.json()) as Dashboard);

      // Funnel is best-effort — don't fail the whole page if it errors.
      if (funnelRes.ok) {
        setFunnel((await funnelRes.json()) as Funnel);
      } else {
        setFunnel(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  return (
    <PageShell activePath="/admin/analytics">
      <section className="float-up space-y-4 sm:space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">
              ChatView Insights
            </p>
            <h1 className="headline-glow mt-2 text-xl font-bold sm:text-3xl">
              Analytics dashboard
            </h1>
            <p className="mt-1 text-sm text-(--muted)">
              Cookieless, first-party traffic for{" "}
              <span className="font-mono">{data?.site ?? "chat-view.xyz"}</span>.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Range"
            className="inline-flex overflow-hidden rounded-full border border-(--line) text-sm"
          >
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                role="tab"
                aria-selected={days === opt}
                onClick={() => setDays(opt)}
                className={`px-3 py-1.5 transition ${
                  days === opt
                    ? "bg-(--accent) text-white"
                    : "text-(--muted) hover:bg-(--panel-soft)"
                }`}
              >
                {opt === 1 ? "24h" : `${opt}d`}
              </button>
            ))}
          </div>
        </header>

        {loading && !data && (
          <p className="text-sm text-(--muted)">Loading…</p>
        )}

        {error && (
          <div className="rounded-2xl border border-(--line) bg-(--panel-soft) p-4 text-sm text-(--muted)">
            {error}
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <StatCard label="Pageviews" value={data.totals.pageviews} />
              <StatCard
                label="Unique visitors"
                value={data.totals.unique_visitors}
              />
              <StatCard label="Sessions" value={data.totals.sessions} />
              <StatCard label="Custom events" value={data.totals.events} />
            </div>

            <Section title="Traffic by day">
              <ByDayChart series={data.by_day} />
            </Section>

            {funnel && <FunnelSection funnel={funnel} />}

            <div className="grid gap-4 sm:grid-cols-2">
              <Section title="Top pages">
                <RankedList
                  rows={data.top_paths.map((r) => ({
                    label: r.path || "/",
                    value: r.views,
                  }))}
                />
              </Section>

              <Section title="Top referrers">
                <RankedList
                  rows={data.top_referrer_hosts.map((r) => ({
                    label: r.referrer_host,
                    value: r.views,
                  }))}
                  emptyText="No external referrers yet — direct + dark social only."
                />
              </Section>

              <Section title="Top UTM sources">
                <RankedList
                  rows={data.top_utm_sources.map((r) => ({
                    label: r.utm_source,
                    value: r.views,
                  }))}
                  emptyText="No tagged campaigns yet. Add ?utm_source=… to launch links."
                />
              </Section>

              <Section title="Device split">
                <RankedList
                  rows={data.device_split.map((r) => ({
                    label: r.device || "unknown",
                    value: r.views,
                  }))}
                />
              </Section>

              <Section title="Top countries">
                <RankedList
                  rows={data.country_split.map((r) => ({
                    label: r.country,
                    value: r.views,
                  }))}
                  emptyText="Country data needs Cloudflare or Azure Front Door in front of the API."
                />
              </Section>
            </div>

            <p className="text-center text-xs text-(--muted)">
              Window: {data.totals.window_days} day
              {data.totals.window_days === 1 ? "" : "s"} · since{" "}
              {new Date(data.totals.since).toLocaleString()}
            </p>
          </>
        )}
      </section>
    </PageShell>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function RankedList({
  rows,
  emptyText = "No data in this window.",
}: {
  rows: { label: string; value: number }[];
  emptyText?: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-(--muted)">{emptyText}</p>;
  }
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="space-y-1">
      {rows.map((r) => (
        <BarRow key={r.label} label={r.label} value={r.value} max={max} />
      ))}
    </div>
  );
}

function FunnelSection({ funnel }: { funnel: Funnel }) {
  const top = funnel.steps[0]?.sessions ?? 0;
  return (
    <Section
      title={`Conversion funnel · ${funnel.overall_conversion_pct}% pricing → paid`}
    >
      {top === 0 ? (
        <p className="text-sm text-(--muted)">
          No funnel events in this window. Visit /pricing to seed one.
        </p>
      ) : (
        <div className="space-y-2">
          {funnel.steps.map((step) => {
            const pct = top > 0 ? Math.round((step.sessions / top) * 100) : 0;
            const widthPct = Math.max(2, pct);
            return (
              <div key={step.event}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">{step.label}</span>
                  <span className="tabular-nums text-(--muted)">
                    {step.sessions.toLocaleString()} sessions
                    {step.conversion_from_prev_pct !== null && (
                      <>
                        {" · "}
                        <span className="font-mono text-(--foreground)">
                          {step.conversion_from_prev_pct}%
                        </span>{" "}
                        from prev
                        {step.drop_off_from_prev != null &&
                          step.drop_off_from_prev > 0 && (
                            <>
                              {" · "}
                              <span className="text-(--warning)">
                                −{step.drop_off_from_prev} drop-off
                              </span>
                            </>
                          )}
                      </>
                    )}
                  </span>
                </div>
                <div className="mt-1 h-3 rounded-full bg-(--panel-soft)">
                  <div
                    className="h-3 rounded-full bg-(--accent)"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}

function ByDayChart({ series }: { series: DaySeries[] }) {
  if (!series.length) {
    return <p className="text-sm text-(--muted)">No data yet.</p>;
  }
  const max = Math.max(...series.map((d) => d.views), 1);
  return (
    <div>
      <div className="flex h-32 items-end gap-1">
        {series.map((d) => {
          const h = Math.max(2, Math.round((d.views / max) * 100));
          return (
            <div
              key={d.day}
              className="flex flex-1 flex-col items-center justify-end"
              title={`${d.day} · ${d.views} views · ${d.unique_visitors} visitors`}
            >
              <div
                className="w-full rounded-t bg-(--accent)"
                style={{ height: `${h}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-(--muted)">
        <span>{series[0]?.day}</span>
        <span>{series[series.length - 1]?.day}</span>
      </div>
    </div>
  );
}
