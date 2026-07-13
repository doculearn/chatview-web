"use client";

/**
 * Google One Tap auto sign-in.
 *
 * Shows Google's One Tap prompt (top-right, like other Google sites) for
 * logged-out visitors. On credential, it signs into Firebase with the Google
 * ID token and reuses the existing ChatView exchange — no backend change.
 *
 * Requires NEXT_PUBLIC_GOOGLE_CLIENT_ID (the Firebase project's Web OAuth
 * client ID). If unset, the component is a no-op.
 */

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";
import {
  exchangeGoogleIdToken,
  type GoogleExchangeResult,
} from "@/lib/firebase-auth";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const GSI_SRC = "https://accounts.google.com/gsi/client";

// Routes where the One Tap prompt should not interrupt the user.
const SUPPRESSED_PREFIXES = ["/login", "/register", "/account", "/callback"];

type CredentialResponse = { credential?: string };

type GoogleIdApi = {
  initialize: (config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    use_fedcm_for_prompt?: boolean;
    context?: "signin" | "signup" | "use";
  }) => void;
  prompt: () => void;
  cancel: () => void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleIdApi } };
  }
}

function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GSI_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google Identity Services")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
}

export function GoogleOneTap() {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthCredentialsStore((state) => state.accessToken);
  const hasHydrated = useAuthCredentialsStore((state) => state.hasHydrated);
  const setCredentials = useAuthCredentialsStore(
    (state) => state.setCredentials,
  );
  const initialized = useRef(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    // Wait for the persisted store to hydrate before deciding to prompt.
    if (!hasHydrated) return;
    // Already signed in, or on a route where the prompt would be intrusive.
    if (accessToken) return;
    if (SUPPRESSED_PREFIXES.some((p) => pathname?.startsWith(p))) return;
    // One Tap should be shown at most once per mount.
    if (initialized.current) return;
    initialized.current = true;

    let cancelled = false;

    const handleCredential = async (response: CredentialResponse) => {
      if (!response.credential) return;
      try {
        const data: GoogleExchangeResult = await exchangeGoogleIdToken(
          response.credential,
        );
        if (!data.success) return;

        const tokens = (data.tokens ?? {}) as Record<string, unknown>;
        const user = (data.user ?? {}) as Record<string, unknown>;

        const token =
          (typeof tokens.access_token === "string" && tokens.access_token) ||
          (typeof tokens.azure_access_token === "string" &&
            tokens.azure_access_token) ||
          null;

        setCredentials({
          accessToken: token,
          refreshToken:
            typeof tokens.refresh_token === "string"
              ? tokens.refresh_token
              : null,
          sessionId:
            typeof data.session_id === "string" ? data.session_id : null,
          username: typeof user.username === "string" ? user.username : null,
          firstname:
            typeof user.firstname === "string"
              ? user.firstname
              : typeof user.first_name === "string"
                ? user.first_name
                : null,
          lastname:
            typeof user.lastname === "string"
              ? user.lastname
              : typeof user.last_name === "string"
                ? user.last_name
                : null,
          email: typeof user.email === "string" ? user.email : null,
        });

        router.replace(data.subscription_active ? "/account" : "/pricing");
      } catch {
        // Silent: One Tap is best-effort; the visitor can still use the button.
      }
    };

    loadGsiScript()
      .then(() => {
        const idApi = window.google?.accounts?.id;
        if (!idApi || cancelled) return;
        idApi.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredential,
          auto_select: true,
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: true,
          context: "signin",
        });
        idApi.prompt();
      })
      .catch(() => {
        // Ignore load failures — the explicit Google button remains available.
      });

    return () => {
      cancelled = true;
      window.google?.accounts?.id?.cancel();
    };
  }, [accessToken, hasHydrated, pathname, router, setCredentials]);

  return null;
}
