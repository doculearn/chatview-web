"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";

interface DayStat {
  date: string;
  total: number;
  succeeded: number;
  failed: number;
}

interface UsageStats {
  all_time: { total: number; succeeded: number; failed: number };
  this_month: { total: number; succeeded: number; failed: number };
  today: { total: number; succeeded: number; failed: number };
  daily: DayStat[];
}

export function UsageStats() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await authFetch("/api/chatview/usage");
        if (res.ok) setStats(await res.json());
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Usage</p>
        <p className="mt-4 text-sm text-(--muted)">Loading stats...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Usage</p>
        <p className="mt-4 text-sm text-(--muted)">Could not load usage data.</p>
      </div>
    );
  }

  const maxDaily = Math.max(...stats.daily.map((d) => d.total), 1);

  return (
    <div className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6">
      <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Prompt Usage</p>

      {/* Stat cards */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatCard label="Today" stat={stats.today} />
        <StatCard label="This Month" stat={stats.this_month} />
        <StatCard label="All Time" stat={stats.all_time} />
      </div>

      {/* 7-day bar chart */}
      <div className="mt-6">
        <p className="text-xs font-medium text-(--muted) mb-3">Last 7 Days</p>
        <div className="flex items-end gap-1.5 h-24">
          {stats.daily.map((day) => {
            const pct = maxDaily > 0 ? (day.total / maxDaily) * 100 : 0;
            const failPct = day.total > 0 ? (day.failed / day.total) * 100 : 0;
            const dayLabel = new Date(day.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" });
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-sm overflow-hidden" style={{ height: `${Math.max(pct, 4)}%` }}>
                  <div
                    className="w-full rounded-sm"
                    style={{
                      height: `${100 - failPct}%`,
                      background: "var(--accent-primary, #1aa6ff)",
                    }}
                  />
                  {failPct > 0 && (
                    <div
                      className="w-full"
                      style={{ height: `${failPct}%`, background: "#ef4444" }}
                    />
                  )}
                </div>
                <span className="text-[10px] text-(--muted)">{dayLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex gap-4 text-[11px] text-(--muted)">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent-primary, #1aa6ff)" }} />
          Succeeded
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Failed
        </span>
      </div>
    </div>
  );
}

function StatCard({ label, stat }: { label: string; stat: { total: number; succeeded: number; failed: number } }) {
  const successRate = stat.total > 0 ? Math.round((stat.succeeded / stat.total) * 100) : 0;

  return (
    <div className="feature-card rounded-xl p-3">
      <p className="text-[11px] text-(--muted) font-medium">{label}</p>
      <p className="text-xl font-bold mt-1">{stat.total}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-[10px] text-green-400">{stat.succeeded} ok</span>
        {stat.failed > 0 && <span className="text-[10px] text-red-400">{stat.failed} fail</span>}
      </div>
      {stat.total > 0 && (
        <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-green-400" style={{ width: `${successRate}%` }} />
        </div>
      )}
    </div>
  );
}
