import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ChatView",
  description:
    "ChatView privacy policy — how we collect, use, and share your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell activePath="/privacy-policy">
      <section className="glass-panel rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">
          Legal
        </p>
        <h1 className="mt-3 text-2xl font-bold sm:text-4xl lg:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-(--muted)">
          Effective date: April 15, 2026. This Privacy Policy explains how
          Doculearn (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, shares, and
          protects information when you use the ChatView application and related
          services, including the website, VS Code extension, and mobile
          application (collectively, the &quot;Service&quot;).
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-(--foreground)">
          {/* 1 ------------------------------------------------------------ */}
          <section>
            <h2 className="text-xl font-semibold">
              1. Information We Collect
            </h2>

            <h3 className="mt-3 font-semibold text-(--foreground)">
              1.1 Information You Provide
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-(--muted)">
              <li>
                <strong>Account information</strong> — name, email address, and
                profile details you supply when creating an account.
              </li>
              <li>
                <strong>Payment information</strong> — billing details processed
                by our third-party payment provider; we do not store full payment
                card numbers.
              </li>
              <li>
                <strong>Support and communications</strong> — messages and
                attachments you send when contacting support.
              </li>
            </ul>

            <h3 className="mt-3 font-semibold text-(--foreground)">
              1.2 Information Collected Automatically
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-(--muted)">
              <li>
                <strong>Device and usage data</strong> — device model, operating
                system version, unique device identifiers, app version, crash
                logs, and feature-usage analytics.
              </li>
              <li>
                <strong>Log data</strong> — IP address, access times, pages
                viewed, and referring URLs.
              </li>
              <li>
                <strong>Session metadata</strong> — relay and coding session
                information required to operate the Service.
              </li>
            </ul>

            <h3 className="mt-3 font-semibold text-(--foreground)">
              1.3 Information from Third Parties
            </h3>
            <p className="mt-2 text-(--muted)">
              If you sign in through a third-party provider (e.g., GitHub or
              Google), we may receive your name, email, and public profile
              information as permitted by the provider.
            </p>
          </section>

          {/* 2 ------------------------------------------------------------ */}
          <section>
            <h2 className="text-xl font-semibold">
              2. How We Use Your Information
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-(--muted)">
              <li>Provide, operate, and maintain the Service.</li>
              <li>
                Process transactions and send related information, including
                purchase confirmations and invoices.
              </li>
              <li>
                Authenticate users and enforce security measures to protect
                accounts.
              </li>
              <li>
                Diagnose technical issues, monitor performance, and improve
                reliability.
              </li>
              <li>
                Communicate product updates, policy changes, and promotional
                offers (you can opt out at any time).
              </li>
              <li>Comply with legal obligations and enforce our agreements.</li>
            </ul>
          </section>

          {/* 3 ------------------------------------------------------------ */}
          <section>
            <h2 className="text-xl font-semibold">
              3. How We Share Your Information
            </h2>
            <p className="mt-2 text-(--muted)">
              We do <strong>not</strong> sell your personal data. We may share
              information in the following circumstances:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-(--muted)">
              <li>
                <strong>Service providers</strong> — trusted vendors that
                perform services on our behalf, such as hosting, analytics,
                payment processing, and customer support, under contractual
                confidentiality obligations.
              </li>
              <li>
                <strong>Legal requirements</strong> — when required by law,
                regulation, subpoena, or court order.
              </li>
              <li>
                <strong>Business transfers</strong> — in connection with a
                merger, acquisition, or sale of assets, with notice to affected
                users.
              </li>
              <li>
                <strong>With your consent</strong> — when you direct us to share
                data with a third party.
              </li>
            </ul>
          </section>

          {/* 4 ------------------------------------------------------------ */}
          <section>
            <h2 className="text-xl font-semibold">
              4. Data Retention
            </h2>
            <p className="mt-2 text-(--muted)">
              We retain personal data only as long as reasonably necessary to
              fulfil the purposes described in this policy, comply with legal
              obligations, resolve disputes, and enforce our agreements. When
              data is no longer needed, it is securely deleted or anonymized.
            </p>
          </section>

          {/* 5 ------------------------------------------------------------ */}
          <section>
            <h2 className="text-xl font-semibold">
              5. Data Security
            </h2>
            <p className="mt-2 text-(--muted)">
              We implement reasonable technical and organizational measures —
              including encryption in transit and at rest — to protect your data
              against unauthorized access, alteration, disclosure, or
              destruction. No method of transmission or storage is 100 % secure;
              we cannot guarantee absolute security.
            </p>
          </section>

          {/* 6 ------------------------------------------------------------ */}
          <section>
            <h2 className="text-xl font-semibold">
              6. Your Rights and Choices
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-(--muted)">
              <li>
                <strong>Access and portability</strong> — request a copy of the
                personal data we hold about you.
              </li>
              <li>
                <strong>Correction</strong> — request correction of inaccurate
                or incomplete data.
              </li>
              <li>
                <strong>Deletion</strong> — request deletion of your personal
                data, subject to legal retention requirements.
              </li>
              <li>
                <strong>Opt-out of marketing</strong> — unsubscribe from
                promotional emails via the link in each message.
              </li>
              <li>
                <strong>Withdraw consent</strong> — where processing is based on
                consent, you may withdraw it at any time.
              </li>
            </ul>
            <p className="mt-2 text-(--muted)">
              To exercise any of these rights, contact us at the address listed
              below.
            </p>
          </section>

          {/* 7 ------------------------------------------------------------ */}
          <section>
            <h2 className="text-xl font-semibold">
              7. Children&apos;s Privacy
            </h2>
            <p className="mt-2 text-(--muted)">
              The Service is not directed at children under the age of 13 (or
              the applicable age of consent in your jurisdiction). We do not
              knowingly collect personal data from children. If you believe we
              have inadvertently collected such data, please contact us and we
              will promptly delete it.
            </p>
          </section>

          {/* 8 ------------------------------------------------------------ */}
          <section>
            <h2 className="text-xl font-semibold">
              8. Third-Party Links and Services
            </h2>
            <p className="mt-2 text-(--muted)">
              The Service may contain links to third-party websites or services.
              We are not responsible for the privacy practices of those third
              parties. We encourage you to read their privacy policies before
              providing any personal data.
            </p>
          </section>

          {/* 9 ------------------------------------------------------------ */}
          <section>
            <h2 className="text-xl font-semibold">
              9. Advertising
            </h2>
            <p className="mt-2 text-(--muted)">
              ChatView does not display third-party advertisements. If this
              changes in the future, we will update this policy and disclose the
              types of ads and ad partners involved.
            </p>
          </section>

          {/* 10 ----------------------------------------------------------- */}
          <section>
            <h2 className="text-xl font-semibold">
              10. International Data Transfers
            </h2>
            <p className="mt-2 text-(--muted)">
              Your information may be processed in countries other than your own.
              We take appropriate safeguards to ensure your data receives an
              adequate level of protection in the jurisdictions in which we
              process it.
            </p>
          </section>

          {/* 11 ----------------------------------------------------------- */}
          <section>
            <h2 className="text-xl font-semibold">
              11. Changes to This Privacy Policy
            </h2>
            <p className="mt-2 text-(--muted)">
              We may update this Privacy Policy from time to time. When we make
              material changes, we will notify you by posting the revised policy
              on this page with a new effective date. Your continued use of the
              Service after the effective date constitutes acceptance of the
              updated policy.
            </p>
          </section>

          {/* 12 ----------------------------------------------------------- */}
          <section>
            <h2 className="text-xl font-semibold">12. Contact Us</h2>
            <p className="mt-2 text-(--muted)">
              If you have questions or concerns about this Privacy Policy or our
              data practices, please contact Doculearn support through the
              ChatView account channel or email us at{" "}
              <a
                href="mailto:support@doculearn.io"
                className="underline decoration-(--line) underline-offset-4 hover:text-(--foreground)"
              >
                support@doculearn.io
              </a>
              .
            </p>
            <p className="mt-3 text-(--muted)">
              See also our{" "}
              <Link
                href="/terms-of-service"
                className="underline decoration-(--line) underline-offset-4 hover:text-(--foreground)"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-statement"
                className="underline decoration-(--line) underline-offset-4 hover:text-(--foreground)"
              >
                Privacy Statement
              </Link>
              .
            </p>
          </section>
        </div>
      </section>
    </PageShell>
  );
}
