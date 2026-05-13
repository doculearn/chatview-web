import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | ChatView",
  description:
    "Get help with ChatView — contact support, find documentation, and troubleshoot the VS Code extension and mobile app.",
};

export default function SupportPage() {
  return (
    <PageShell activePath="/support">
      <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">
          Help Center
        </p>
        <h1 className="mt-3 text-2xl font-bold sm:text-4xl lg:text-5xl">
          ChatView Support
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-(--muted)">
          We&apos;re here to help. Reach out with questions about your account,
          subscription, the VS Code extension, or the mobile app — we typically
          reply within one business day.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-(--line) bg-(--panel-soft) p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-(--accent-2)">
              Email
            </p>
            <p className="mt-3 text-lg font-semibold">
              <a
                href="mailto:hello@chat-view.xyz"
                className="text-(--accent) hover:underline"
              >
                hello@chat-view.xyz
              </a>
            </p>
            <p className="mt-2 text-sm text-(--muted)">
              The fastest way to get a response. Include your account email and
              a description of the issue.
            </p>
          </div>

          <div className="rounded-2xl border border-(--line) bg-(--panel-soft) p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-(--accent-2)">
              Account
            </p>
            <p className="mt-3 text-lg font-semibold">
              <Link
                href="/account"
                className="text-(--accent) hover:underline"
              >
                Manage your account
              </Link>
            </p>
            <p className="mt-2 text-sm text-(--muted)">
              View your subscription, update billing, or cancel your plan at any
              time.
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-7 text-(--foreground)">
          <section>
            <h2 className="text-xl font-semibold">Common topics</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-(--muted)">
              <li>
                <strong>Getting started</strong> — install the{" "}
                <Link
                  href="https://marketplace.visualstudio.com/items?itemName=doculearn.chatview-relay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--accent) hover:underline"
                >
                  VS Code extension
                </Link>
                {" "}and the{" "}
                <Link
                  href="https://play.google.com/store/apps/details?id=com.chatviewmobile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--accent) hover:underline"
                >
                  mobile app
                </Link>
                , then sign in with the same account on both.
              </li>
              <li>
                <strong>Pairing your phone</strong> — run{" "}
                <code className="rounded bg-(--panel) px-1.5 py-0.5 text-(--foreground)">
                  ChatView: Start Relay Session
                </code>
                {" "}in VS Code and scan the QR code from the mobile app.
              </li>
              <li>
                <strong>Subscription &amp; billing</strong> — view invoices,
                change plan, or cancel from your{" "}
                <Link href="/account" className="text-(--accent) hover:underline">
                  account page
                </Link>
                . Your 3-day free trial starts on first sign-in.
              </li>
              <li>
                <strong>Connection issues</strong> — make sure your workstation
                and phone are signed in to the same ChatView account and that
                the VS Code extension shows &quot;relay: connected&quot; in the
                status bar.
              </li>
              <li>
                <strong>Account deletion</strong> — request deletion from the{" "}
                <Link
                  href="/delete-account"
                  className="text-(--accent) hover:underline"
                >
                  delete account page
                </Link>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Legal &amp; policies</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-(--muted)">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-(--accent) hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-(--accent) hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </PageShell>
  );
}
