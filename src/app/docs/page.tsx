import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function DocsPage() {
  return (
    <PageShell activePath="/docs">
      <section className="glass-panel float-up rounded-3xl p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Docs</p>
        <h1 className="headline-glow mt-3 text-3xl font-bold sm:text-4xl">Get Started in 5 Minutes</h1>
        <p className="mt-4 max-w-3xl text-(--muted)">
          Connect your VS Code extension, mobile app, and API endpoint so you can run prompts and coding workflows from your phone.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
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
              Download the latest APK and sign in with the same account used in VS Code.
            </p>
            <Link
              href="https://github.com/doculearn/chatview-mobile/releases"
              className="mt-4 inline-block text-sm font-semibold text-(--accent-2)"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download latest APK
            </Link>
          </article>

          <article className="feature-card">
            <h2 className="text-lg font-semibold">3. Confirm backend URL</h2>
            <p className="mt-2 text-sm text-(--muted)">
              Use the production API endpoint and ensure your token/session is valid.
            </p>
            <p className="mt-4 rounded-lg border border-white/10 bg-black/20 p-2 font-mono text-xs text-(--accent-2)">
              https://api.chat-view.xyz/api/v1
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
