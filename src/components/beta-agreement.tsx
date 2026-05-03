export const BETA_AGREEMENT_VERSION = "1.0.0";

export function BetaAgreementText() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-(--foreground)/90">
      <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">
        Agreement v{BETA_AGREEMENT_VERSION}
      </p>
      <p>
        By accepting this agreement and joining the ChatView closed beta program (&quot;Beta&quot;),
        you (&quot;Tester&quot;) agree to the following terms with Doculearn (&quot;Provider&quot;):
      </p>

      <h3 className="text-base font-semibold">1. Access</h3>
      <p>
        You are granted a personal, non-exclusive, non-transferable, revocable right to install
        and use the ChatView pre-release software (&quot;Beta Software&quot;) on devices you own or
        control, solely for the purpose of evaluating it and providing feedback to Doculearn.
      </p>

      <h3 className="text-base font-semibold">2. Confidentiality</h3>
      <p>
        The Beta Software, its features, screens, behavior, performance, bugs, roadmap, and any
        related materials (collectively, &quot;Confidential Information&quot;) are proprietary and
        confidential. You agree to keep them confidential and to not disclose them to any third
        party without prior written permission. Confidentiality obligations survive for 3 years
        from the date of disclosure.
      </p>

      <h3 className="text-base font-semibold">3. No Redistribution</h3>
      <p>
        You will not share, redistribute, upload, mirror, publish, or otherwise make the Beta
        Software (including any APK, AAB, IPA, build artifact, or account access) available to
        anyone outside the Beta program.
      </p>

      <h3 className="text-base font-semibold">4. No Reverse Engineering</h3>
      <p>
        You will not decompile, disassemble, reverse engineer, or attempt to derive source code,
        algorithms, models, prompts, or trade secrets from the Beta Software, except to the
        extent such restriction is prohibited by applicable law.
      </p>

      <h3 className="text-base font-semibold">5. No Competing Products</h3>
      <p>
        For 12 months after you receive access, you will not, directly or indirectly, design,
        develop, launch, fund, or assist in the design, development, or launch of any product or
        service that is substantially similar to ChatView or that competes with ChatView&apos;s
        core features (including, without limitation, mobile-to-IDE AI assistant relays, remote
        approval/permission flows for AI coding agents, or chat-based bridging between mobile
        devices and developer tools).
      </p>

      <h3 className="text-base font-semibold">6. No Copying of UI / UX / Brand</h3>
      <p>
        You will not copy, replicate, or create derivatives of ChatView&apos;s user interface,
        user experience, brand, name, logo, marketing copy, or distinctive visual elements.
      </p>

      <h3 className="text-base font-semibold">7. Intellectual Property</h3>
      <p>
        All intellectual property rights in the Beta Software remain with Doculearn. No license
        is granted except as expressly stated in this agreement. Feedback you submit may be used
        by Doculearn without restriction or compensation.
      </p>

      <h3 className="text-base font-semibold">8. No Warranty</h3>
      <p>
        The Beta Software is provided &quot;AS IS&quot; without warranty of any kind. Doculearn
        is not liable for any damages, data loss, or business interruption arising from your use
        of the Beta Software.
      </p>

      <h3 className="text-base font-semibold">9. Term and Termination</h3>
      <p>
        This agreement begins when you accept it and ends when the Beta program ends or when
        Doculearn revokes your access. Sections 2, 3, 4, 5, 6, 7, and 8 survive termination.
      </p>

      <h3 className="text-base font-semibold">10. Governing Law</h3>
      <p>
        This agreement is governed by the laws of the Provider&apos;s jurisdiction, without
        regard to conflict-of-law principles.
      </p>
    </div>
  );
}
