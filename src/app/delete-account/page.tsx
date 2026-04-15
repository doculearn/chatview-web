"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { authFetch } from "@/lib/auth-fetch";
import { performLogout } from "@/lib/logout";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

export default function DeleteAccountPage() {
  const router = useRouter();
  const email = useAuthCredentialsStore((state) => state.email);
  const accessToken = useAuthCredentialsStore((state) => state.accessToken);

  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmed = confirmText === "DELETE";
  const isLoggedIn = Boolean(accessToken);

  async function handleDelete() {
    if (!confirmed) return;
    setDeleting(true);
    setError(null);

    try {
      const res = await authFetch("/api/chatview/account", { method: "DELETE" });

      if (res.ok) {
        performLogout("/login");
      } else {
        const data = await res.json().catch(() => null);
        setError(
          (data as Record<string, string> | null)?.error ??
            "Failed to delete account. Please try again or contact support."
        );
      }
    } catch {
      setError("Something went wrong. Please try again or contact support.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <PageShell activePath="/delete-account">
      <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">Account</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-4xl lg:text-5xl">Delete Your Account</h1>

        <div className="mt-6 max-w-2xl space-y-6 text-sm leading-7 text-(--foreground)">
          {/* Steps */}
          <div>
            <h2 className="text-lg font-semibold">How to delete your ChatView account</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-(--muted)">
              <li>
                <Link href="/login" className="underline underline-offset-4 hover:text-(--foreground)">
                  Sign in
                </Link>{" "}
                to your ChatView account{email ? <> (<strong>{email}</strong>)</> : null}.
              </li>
              <li>Return to this page or go to <strong>Account &gt; Delete Account</strong>.</li>
              <li>
                Type <strong>DELETE</strong> in the confirmation field below and click the
                button.
              </li>
            </ol>
          </div>

          {/* What gets deleted */}
          <div>
            <h2 className="text-lg font-semibold">What data is deleted</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-(--muted)">
              <li>Your account profile (name, email, preferences).</li>
              <li>Authentication and session data.</li>
              <li>Subscription and billing records (after any legally required retention period).</li>
              <li>Usage history and analytics tied to your account.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">What may be retained</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-(--muted)">
              <li>Anonymized or aggregated analytics that can no longer identify you.</li>
              <li>Records required by law, regulation, or legal proceedings.</li>
            </ul>
            <p className="mt-2 text-(--muted)">
              Retained records are kept for the minimum period required and then permanently
              deleted.
            </p>
          </div>

          {/* Confirmation */}
          {isLoggedIn ? (
            <div className="feature-card space-y-4">
              <p className="text-(--muted)">
                This action is <strong className="text-red-400">permanent and cannot be undone</strong>.
                Type <strong>DELETE</strong> to confirm.
              </p>

              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full rounded-lg border border-(--line) bg-transparent px-4 py-2 text-sm text-(--foreground) placeholder:text-(--muted) focus:outline-none focus:ring-1 focus:ring-(--accent)"
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                onClick={handleDelete}
                disabled={!confirmed || deleting}
                className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-opacity hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? "Deleting…" : "Permanently Delete My Account"}
              </button>
            </div>
          ) : (
            <div className="feature-card">
              <p className="text-(--muted)">
                You must be signed in to delete your account.{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-(--foreground)"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}

          <p className="text-xs text-(--muted)">
            Need help?{" "}
            <a
              href="mailto:support@doculearn.io"
              className="underline underline-offset-4 hover:text-(--foreground)"
            >
              Contact support
            </a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
