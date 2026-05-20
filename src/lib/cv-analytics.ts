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
  // Signup
  | "signup_started"
  | "signup_completed"
  | "signup_failed"
  // Subscription / checkout
  | "checkout_started"
  | "checkout_completed"
  | "checkout_failed"
  | "checkout_cancelled"
  // Beta program
  | "beta_signup_completed"
  // Acquisition / CTAs
  | "cta_clicked"
  | "pricing_viewed"
  // QR / pairing
  | "pair_started"
  | "pair_completed";

// Map our internal funnel events to GA4 reserved/recommended event
// names so they're recognised in the Events report and can be marked
// as key events without creating synthetic events in the GA4 UI.
//   - sign_up        — recommended event for account creation
//   - purchase       — recommended event for paid conversion
//   - generate_lead  — recommended event for waitlist / lead capture
const GA4_EVENT_MAP: Record<string, string> = {
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
    const ga4Name = GA4_EVENT_MAP[event];
    if (!ga4Name) return;
    gtag("event", ga4Name, props ?? {});
  } catch {
    // Analytics must never throw into product code.
  }
}
