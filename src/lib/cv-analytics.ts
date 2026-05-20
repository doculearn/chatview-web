"use client";

/**
 * Thin, SSR-safe wrapper over the global `window.cv.track` set up by
 * <UsermavenLite/>. All call sites should import from here instead of
 * touching `window.cv` directly — keeps event names and prop shapes
 * documented in one place and makes the analytics tracker swappable.
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
}
