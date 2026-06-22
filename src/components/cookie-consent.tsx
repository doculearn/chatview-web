"use client";

/**
 * Cookie consent banner + consent-gated Google Analytics.
 *
 * The in-house analytics (UsermavenLite) is cookieless and stays on for
 * everyone. The only cookie-setting tracker on the site is Google
 * Analytics, so it is loaded ONLY after the visitor explicitly opts in.
 *
 * Choice is persisted in the `cv_cookie_consent` cookie ("accepted" |
 * "declined") for a year. Changing the choice dispatches a window event
 * so the analytics gate reacts without a full page reload.
 */

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { GoogleAnalytics } from "@next/third-parties/google";

const CONSENT_COOKIE = "cv_cookie_consent";
const CONSENT_EVENT = "cv:cookie-consent-changed";
const COOKIE_MAX_AGE_DAYS = 365;
const GA_ID = "G-9603SMF2Q3";

type ConsentValue = "accepted" | "declined";

function readConsent(): ConsentValue | null {
  const value = Cookies.get(CONSENT_COOKIE);
  return value === "accepted" || value === "declined" ? value : null;
}

function writeConsent(value: ConsentValue) {
  Cookies.set(CONSENT_COOKIE, value, {
    expires: COOKIE_MAX_AGE_DAYS,
    sameSite: "Lax",
    secure: typeof window !== "undefined" && window.location.protocol === "https:",
    path: "/",
  });
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

function clearConsent() {
  Cookies.remove(CONSENT_COOKIE, { path: "/" });
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}

/**
 * Reads the current consent choice and re-renders when it changes.
 * Returns `null` on the server and until the cookie is read on the client,
 * which also keeps the banner from flashing for visitors who already chose.
 */
function useConsent(): ConsentValue | null {
  return useSyncExternalStore(subscribe, readConsent, () => null);
}

/**
 * Renders Google Analytics only when the visitor has accepted cookies.
 * Renders nothing on the server and until consent is granted, so no GA
 * cookies are set without opt-in.
 */
export function ConsentGatedAnalytics() {
  const consent = useConsent();
  if (consent !== "accepted") return null;
  return <GoogleAnalytics gaId={GA_ID} />;
}

/**
 * The opt-in / opt-out banner. Shown until the visitor makes a choice.
 */
export function CookieConsent() {
  const consent = useConsent();
  if (consent !== null) return null;

  const decide = (value: ConsentValue) => {
    writeConsent(value);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
    >
      <div className="glass-panel mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-(--muted)">
          We use cookies to measure traffic and improve ChatView. Essential
          cookies are always on; analytics cookies (Google Analytics) load only
          if you accept. See our{" "}
          <Link
            href="/privacy-policy"
            className="text-(--accent) underline underline-offset-2 hover:text-(--accent-2)"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="rounded-lg border border-(--line) px-4 py-2 text-sm font-medium text-(--foreground) transition-colors hover:bg-(--panel-soft)"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-(--accent-2)"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * A link/button to re-open the consent banner so visitors can change
 * their earlier choice. Drop it in the footer.
 */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={clearConsent} className={className}>
      Cookie settings
    </button>
  );
}
