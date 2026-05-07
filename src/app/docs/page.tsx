import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function DocsPage() {
  return (
    <PageShell activePath="/docs">
      <section className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Docs</p>
        <h1 className="headline-glow mt-3 text-xl font-bold sm:text-3xl lg:text-4xl">Get Started in 5 Minutes</h1>
        <p className="mt-4 max-w-3xl text-(--muted)">
          Connect your VS Code extension and mobile app so you can run prompts and coding workflows from your phone.
        </p>

        <div className="mt-5 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2">
          <article className="feature-card">
            <h2 className="text-lg font-semibold">1. Install the extension</h2>
            <p className="mt-2 text-sm text-(--muted)">
              Install ChatView Relay in VS Code and sign in using your ChatView account.
            </p>
            <Link
              href="https://marketplace.visualstudio.com/items?itemName=doculearn.chatview-relay"
              className="mt-4 inline-block text-sm font-semibold text-(--accent-2)"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open extension listing
            </Link>
          </article>

          <article className="feature-card">
            <h2 className="text-lg font-semibold">2. Install the mobile app</h2>
            <p className="mt-2 text-sm text-(--muted)">
              Get ChatView from Google Play (or sideload the APK) and sign in with the same account used in VS Code.
            </p>
            <Link
              href="https://play.google.com/store/apps/details?id=com.chatviewmobile"
              className="mt-4 inline-block text-sm font-semibold text-(--accent-2)"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get it on Google Play
            </Link>
            <Link
              href="https://github.com/doculearn/chatview-mobile/releases"
              className="ml-4 inline-block text-sm font-semibold text-(--muted)"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sideload APK
            </Link>
          </article>

          <article className="feature-card">
            <h2 className="text-lg font-semibold">3. Link your account</h2>
            <p className="mt-2 text-sm text-(--muted)">
              Sign in with the same ChatView account on both devices so your active session stays in sync.
            </p>
          </article>

          <article className="feature-card">
            <h2 className="text-lg font-semibold">4. Start vibe coding</h2>
            <p className="mt-2 text-sm text-(--muted)">
              Send prompts from your phone, execute commands in your workspace, and keep momentum away from your desk.
            </p>
            <Link href="/download" className="mt-4 inline-block text-sm font-semibold text-(--accent-2)">
              Go to downloads
            </Link>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
