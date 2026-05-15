"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";
import {
  GoogleSignInCancelled,
  signInWithGoogleAndExchange,
} from "@/lib/firebase-auth";

type GoogleLoginButtonProps = {
  label?: string;
  disabled?: boolean;
};

export function GoogleLoginButton({
  label = "Continue with Google",
  disabled,
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const setCredentials = useAuthCredentialsStore(
    (state) => state.setCredentials,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (busy || disabled) return;
    setError(null);
    setBusy(true);
    try {
      const data = await signInWithGoogleAndExchange();
      if (!data.success) {
        setError(data.error || "Sign-in failed");
        return;
      }

      const tokens = (data.tokens ?? {}) as Record<string, unknown>;
      const user = (data.user ?? {}) as Record<string, unknown>;

      const accessToken =
        (typeof tokens.access_token === "string" && tokens.access_token) ||
        (typeof tokens.azure_access_token === "string" &&
          tokens.azure_access_token) ||
        null;

      setCredentials({
        accessToken,
        refreshToken:
          typeof tokens.refresh_token === "string" ? tokens.refresh_token : null,
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
    } catch (err) {
      if (err instanceof GoogleSignInCancelled) {
        return;
      }
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  const isDisabled = Boolean(disabled) || busy;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        aria-busy={busy}
        className={`flex h-12 w-full items-center justify-center gap-3 rounded-xl border bg-white text-sm font-semibold text-gray-800 transition hover:border-(--accent) hover:bg-gray-50 ${
          isDisabled
            ? "border-gray-200 opacity-60 cursor-not-allowed"
            : "border-gray-300"
        }`}>
        <GoogleGlyph />
        <span>{busy ? "Opening Google\u2026" : label}</span>
      </button>
      {error ? (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      ) : null}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-5 w-5"
      aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3c-2 1.4-4.5 2.3-7.4 2.3-5.3 0-9.7-3.3-11.3-8L6.1 32C9.3 38.7 16 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.3 5.3c-.4.4 6.4-4.6 6.4-14.9 0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
