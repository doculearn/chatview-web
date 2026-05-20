"use client";

/**
 * ChatView Insights — cookieless, in-house web analytics.
 *
 * Why we run our own instead of leaning on GA alone:
 *   1. GA aggregates aggressively and lags by 24h. We want raw, real-time
 *      pageviews and conversions on /pricing.
 *   2. No third-party cookies, no consent banner, no shared identifier
 *      across sites. The anon id lives in localStorage and resets when
 *      the visitor clears site data.
 *   3. The backend (analytics/views.py) honours DNT and Sec-GPC, hashes
 *      IPs with a daily-rotating salt and drops the raw IP. So this is
 *      strictly less privacy-invasive than GA.
 *
 * Public API on `window`:
 *   window.cv.track(eventName: string, props?: Record<string, unknown>)
 *
 * Pageviews are emitted automatically on initial load and on every Next.js
 * client-side route change.
 */

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const COLLECT_URL =
  process.env.NEXT_PUBLIC_ANALYTICS_URL ||
  "https://api.chat-view.xyz/api/v1/analytics/collect/";
const SITE =
  process.env.NEXT_PUBLIC_ANALYTICS_SITE || "chat-view.xyz";

const STORAGE_KEY = "cv_anon_id";
const SESSION_KEY = "cv_session_id";

declare global {
  interface Window {
    cv?: {
      track: (name: string, props?: Record<string, unknown>) => void;
      anonId: string;
      sessionId: string;
    };
  }
  interface Navigator {
    // Both are non-standard / partial; declare loosely.
    globalPrivacyControl?: boolean;
    doNotTrack?: string | null;
  }
}

function uuid(): string {
  // Browsers without crypto.randomUUID (older Safari) fall back to a
  // best-effort random hex. The id is for our own bucketing — collisions
  // are harmless past 2^64.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  const a = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(a);
  } else {
    for (let i = 0; i < 16; i++) a[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}

function privacyOptedOut(): boolean {
  if (typeof navigator === "undefined") return false;
  if (navigator.globalPrivacyControl === true) return true;
  if (navigator.doNotTrack === "1") return true;
  // Firefox legacy:
  // @ts-expect-error msDoNotTrack is non-standard
  if (window.doNotTrack === "1" || navigator.msDoNotTrack === "1") return true;
  return false;
}

function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ]) {
    const v = sp.get(key);
    if (v) out[key] = v;
  }
  return out;
}

function send(payload: Record<string, unknown>) {
  // Prefer sendBeacon so the request survives navigation. Fall back to
  // fetch with keepalive for the same reason.
  try {
    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    if (navigator.sendBeacon && navigator.sendBeacon(COLLECT_URL, blob)) {
      return;
    }
  } catch {
    // fall through to fetch
  }
  try {
    fetch(COLLECT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      // Public endpoint — no credentials, no cookies.
      credentials: "omit",
      mode: "cors",
    }).catch(() => {});
  } catch {
    // analytics must never throw into product code
  }
}

function buildBase(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;

  let anonId = "";
  let sessionId = "";
  try {
    anonId = localStorage.getItem(STORAGE_KEY) || "";
    if (!anonId) {
      anonId = uuid();
      localStorage.setItem(STORAGE_KEY, anonId);
    }
    sessionId = sessionStorage.getItem(SESSION_KEY) || "";
    if (!sessionId) {
      sessionId = uuid();
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
  } catch {
    // Private mode / storage disabled — fall back to ephemeral ids so
    // the visitor still gets counted (just not de-duplicated across
    // reloads).
    anonId = anonId || uuid();
    sessionId = sessionId || uuid();
  }

  return {
    site: SITE,
    anon_id: anonId,
    session_id: sessionId,
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen_w: window.screen?.width,
    screen_h: window.screen?.height,
    viewport_w: window.innerWidth,
    viewport_h: window.innerHeight,
    ...readUtm(),
  };
}

export function UsermavenLite() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Track the last URL we reported so back-to-back identical effect
  // runs (Strict Mode in dev, etc.) don't double-count.
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (privacyOptedOut()) return;

    const base = buildBase();
    if (!base) return;

    // Expose a tiny ``window.cv.track`` for custom events from buttons,
    // forms, etc. Anyone calling this after mount gets the same anon /
    // session ids as the auto-pageview.
    window.cv = {
      anonId: String(base.anon_id),
      sessionId: String(base.session_id),
      track: (name: string, props?: Record<string, unknown>) => {
        if (privacyOptedOut()) return;
        const b = buildBase();
        if (!b) return;
        send({
          ...b,
          event_type: "custom",
          event_name: name,
          props: props || {},
        });
      },
    };
    // Initial pageview is fired by the URL-change effect below.
  }, []);

  useEffect(() => {
    if (privacyOptedOut()) return;

    const search = searchParams?.toString() || "";
    const url = pathname + (search ? `?${search}` : "");
    if (lastSent.current === url) return;
    lastSent.current = url;

    const base = buildBase();
    if (!base) return;

    send({
      ...base,
      event_type: "pageview",
      path: url,
    });
  }, [pathname, searchParams]);

  return null;
}
