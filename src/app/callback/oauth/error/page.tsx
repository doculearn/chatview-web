"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

function OAuthErrorInner() {
  const searchParams = useSearchParams();
  const code = searchParams.get("error") ?? "unknown_error";
  const description = searchParams.get("error_description") ?? "OAuth sign-in failed.";

  return (
    <PageShell activePath="/login">
      <section className="glass-panel float-up mx-auto w-full max-w-xl rounded-2xl p-6 sm:rounded-3xl sm:p-10 text-center">
        <h1 className="headline-glow text-xl font-bold sm:text-2xl">Sign-in failed</h1>
        <p className="mt-3 text-xs uppercase tracking-[0.24em] text-(--muted)">
          {code}
        </p>
        <p className="mt-4 text-sm text-(--muted)">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-black">
            Back to login
          </Link>
          <Link
            href="/register"
            className="rounded-xl border border-(--line) px-4 py-2 text-sm hover:border-(--accent)">
            Create an account
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

export default function OAuthErrorPage() {
  return (
    <Suspense fallback={null}>
      <OAuthErrorInner />
    </Suspense>
  );
}
