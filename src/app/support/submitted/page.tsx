import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function TicketSubmittedPage({
  searchParams,
}: {
  searchParams: Promise<{ number?: string }>;
}) {
  return <Inner searchParams={searchParams} />;
}

async function Inner({ searchParams }: { searchParams: Promise<{ number?: string }> }) {
  const sp = await searchParams;
  const number = sp.number;
  return (
    <PageShell activePath="/support">
      <section className="glass-panel rounded-2xl p-6 sm:rounded-[2rem] sm:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-(--success)">Submitted</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-4xl">Thanks — we&apos;ve got it.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-(--muted)">
          Your support ticket has been submitted{number ? <> as <strong className="text-(--foreground)">{number}</strong></> : null}.
          We&apos;ve sent a confirmation to the email you provided. A team member will reply soon.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/support"
            className="inline-flex items-center justify-center rounded-xl border border-(--line) px-5 py-3 text-sm font-semibold hover:bg-(--panel-soft)"
          >
            Back to support
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-5 py-3 text-sm font-semibold text-black hover:brightness-110"
          >
            Sign in to track your ticket
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
