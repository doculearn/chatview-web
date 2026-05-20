"use client";

/**
 * Thin, SSR-safe wrapper over the global `window.cv.track` set up by
 * <UsermavenLite/>. All call sites should import from here instead of
 * touching `window.cv` directly — keeps event names and prop shapes
 * documented in one place and makes the analytics tracker swappable.
 *
 * Funnel events that map to GA4 reserved event names are also mirrored
 * to `window.gtag` (installed by <GoogleAnalytics/> in layout.tsx) so
 * they show up in GA4's Events list and can be flagged as key events.
 */

export type FunnelEvent =
  // Acquisition
  | "landing_viewed"
  // Signup
  | "signup_started"
  | "signup_completed"
  | "signup_failed"
  // Subscription / checkout
  | "pricing_viewed"
  | "plan_selected"
  | "checkout_started"
  | "checkout_completed"
  | "checkout_failed"
  | "checkout_cancelled"
  // Beta program
  | "beta_signup_completed"
  // Acquisition / CTAs
  | "cta_clicked"
  // QR / pairing
  | "pair_started"
  | "pair_completed";

// Subset of FunnelEvent we forward to gtag. Anything not in this set
// stays in Usermaven only — useful for high-cardinality or product
// telemetry we don't want bloating GA4's free 500-event-name quota.
const GA4_FORWARDED: ReadonlySet<string> = new Set<FunnelEvent>([
  "landing_viewed",
  "signup_started",
  "signup_completed",
  "signup_failed",
  "pricing_viewed",
  "plan_selected",
  "checkout_started",
  "checkout_completed",
  "checkout_failed",
  "checkout_cancelled",
  "beta_signup_completed",
  "cta_clicked",
]);

// Aliases for events that map to GA4 recommended/reserved names so
// they get special treatment in reports, audiences, and Google Ads
// conversion import:
//   - sign_up        — recommended event for account creation
//   - purchase       — recommended event for paid conversion
//   - generate_lead  — recommended event for waitlist / lead capture
// Internal name still fires too so dashboards built against it keep
// working; the alias is sent as a second gtag call.
const GA4_ALIASES: Record<string, string> = {
  signup_completed: "sign_up",
  checkout_completed: "purchase",
  beta_signup_completed: "generate_lead",
};

type GtagFn = (command: string, eventName: string, params?: Record<string, unknown>) => void;

export function track(
  event: FunnelEvent | string,
  props?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  try {
    window.cv?.track?.(event, props);
  } catch {
    // Analytics must never throw into product code.
  }
  try {
    const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
    if (typeof gtag !== "function") return;
    if (!GA4_FORWARDED.has(event)) return;
    gtag("event", event, props ?? {});
    const alias = GA4_ALIASES[event];
    if (alias) gtag("event", alias, props ?? {});
  } catch {
    // Analytics must never throw into product code.
  }
}
