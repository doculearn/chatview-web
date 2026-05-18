import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "ChatView terms of service — the agreement governing your use of the ChatView website, VS Code extension, and mobile application provided by Doculearn.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <PageShell activePath="/terms-of-service">
      <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">Legal</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-4xl lg:text-5xl">Terms of Service</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-(--muted)">
          Effective date: April 1, 2026. These Terms of Service govern your use of ChatView and related services provided by
          Doculearn.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-(--foreground)">
          <section>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="mt-2 text-(--muted)">
              By accessing or using ChatView, you agree to these Terms. If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Accounts and Access</h2>
            <p className="mt-2 text-(--muted)">
              You are responsible for maintaining the confidentiality of your account and credentials and for all activity under your
              account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Permitted Use</h2>
            <p className="mt-2 text-(--muted)">
              You may use ChatView only for lawful purposes and in compliance with applicable laws, platform terms, and these
              conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Restrictions</h2>
            <p className="mt-2 text-(--muted)">
              You must not misuse the service, interfere with operations, attempt unauthorized access, or use ChatView to distribute
              malicious code or unlawful content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Billing and Subscription</h2>
            <p className="mt-2 text-(--muted)">
              Paid plans are billed according to the plan terms shown at purchase. Fees are non-refundable except where required by
              law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Service Availability</h2>
            <p className="mt-2 text-(--muted)">
              We may modify, suspend, or discontinue parts of the service at any time, including for maintenance and security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
            <p className="mt-2 text-(--muted)">
              To the fullest extent permitted by law, ChatView is provided &quot;as is&quot; without warranties, and Doculearn is not liable for
              indirect, incidental, special, consequential, or punitive damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Termination</h2>
            <p className="mt-2 text-(--muted)">
              We may suspend or terminate access for violations of these Terms or to protect users, systems, or legal compliance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
            <p className="mt-2 text-(--muted)">
              We may update these Terms from time to time. Continued use after changes become effective means you accept the revised
              Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Contact</h2>
            <p className="mt-2 text-(--muted)">
              For questions about these Terms, contact Doculearn support through the ChatView account channel.
            </p>
            <p className="mt-3 text-(--muted)">
              See also our <Link href="/privacy-statement" className="underline decoration-(--line) underline-offset-4 hover:text-(--foreground)">Privacy Statement</Link>.
            </p>
          </section>
        </div>
      </section>
    </PageShell>
  );
}
