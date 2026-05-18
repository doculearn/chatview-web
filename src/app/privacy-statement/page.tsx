import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Privacy Statement",
  description:
    "ChatView privacy statement — how Doculearn collects, uses, and protects your data across the website, VS Code extension, and mobile app.",
  alternates: { canonical: "/privacy-statement" },
};

export default function PrivacyStatementPage() {
  return (
    <PageShell activePath="/privacy-statement">
      <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">Legal</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-4xl lg:text-5xl">Privacy Statement</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-(--muted)">
          Effective date: April 1, 2026. This Privacy Statement explains how Doculearn collects, uses, and protects information
          when you use ChatView, including the website, VS Code extension, and mobile application.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-(--foreground)">
          <section>
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="mt-2 text-(--muted)">
              We may collect account information (name, email), authentication data (session and token details), usage telemetry
              (feature usage and diagnostics), and service metadata needed to operate relay sessions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. How We Use Information</h2>
            <p className="mt-2 text-(--muted)">
              We use data to provide and secure the service, maintain account access, troubleshoot reliability issues, improve user
              experience, and communicate important product and policy updates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Data Sharing</h2>
            <p className="mt-2 text-(--muted)">
              We do not sell personal data. We may share information with trusted service providers that support infrastructure,
              analytics, payment processing, and security operations under contractual confidentiality obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Security</h2>
            <p className="mt-2 text-(--muted)">
              We apply reasonable technical and organizational safeguards to protect data. No system is completely secure, and users
              are responsible for safeguarding account credentials and device access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Data Retention</h2>
            <p className="mt-2 text-(--muted)">
              We retain data only as long as needed for service operation, legal compliance, dispute resolution, and enforcement of
              agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Your Choices</h2>
            <p className="mt-2 text-(--muted)">
              You may request access, correction, or deletion of personal information, subject to legal obligations and legitimate
              business needs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Updates To This Statement</h2>
            <p className="mt-2 text-(--muted)">
              We may update this Privacy Statement from time to time. Material changes will be posted on this page with a revised
              effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Contact</h2>
            <p className="mt-2 text-(--muted)">
              For privacy questions, contact Doculearn support through the ChatView account channel.
            </p>
            <p className="mt-3 text-(--muted)">
              See also our <Link href="/terms-of-service" className="underline decoration-(--line) underline-offset-4 hover:text-(--foreground)">Terms of Service</Link>.
            </p>
          </section>
        </div>
      </section>
    </PageShell>
  );
}
