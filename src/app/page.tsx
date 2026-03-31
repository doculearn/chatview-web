import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function Home() {
  return (
    <PageShell activePath="/">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section id="features" className="glass-panel float-up rounded-3xl p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Build Without Stopping</p>
          <h1 className="headline-glow mt-3 text-3xl font-bold leading-tight sm:text-5xl">Vibe Code From Your Phone</h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-(--muted) sm:text-lg">
            Done for the day? Not quite. Walk away from your desk and keep shipping. Send prompts from mobile, execute commands on your
            workstation, and continue coding from anywhere in the world.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="feature-card">
              <p className="font-mono text-xs text-(--accent-2)">REALTIME</p>
              <p className="mt-1 text-sm text-(--muted)">Live session updates via Web PubSub</p>
            </div>
            <div className="feature-card">
              <p className="font-mono text-xs text-(--accent-2)">REMOTE EXEC</p>
              <p className="mt-1 text-sm text-(--muted)">Run commands and edit files from your phone</p>
            </div>
            <div className="feature-card">
              <p className="font-mono text-xs text-(--accent-2)">SESSION FLOW</p>
              <p className="mt-1 text-sm text-(--muted)">Keep context synced between app and IDE</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="https://marketplace.visualstudio.com/items?itemName=doculearn.chatview-relay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-5 py-3 font-semibold text-black transition hover:brightness-110"
            >
              Install VS Code Extension
            </Link>
            <Link
              href="https://github.com/doculearn/chatview-mobile/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) px-5 py-3 font-semibold text-(--foreground) transition hover:border-(--accent)"
            >
              Download Mobile APK
            </Link>
          </div>
        </section>

        <aside className="space-y-6">
          <section id="connect" className="glass-panel float-up fade-delay-1 rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Security</p>
            <h2 className="mt-2 text-xl font-semibold">Private By Design</h2>
            <p className="mt-3 text-sm text-(--muted)">
              Your phone is the controller, your workstation is the execution engine. ChatView keeps prompts and workflows scoped to your
              authenticated account and active session.
            </p>
            <p className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-(--accent-2)">
              No public API sales messaging. Just secure, account-based product access.
            </p>
          </section>

          <section id="workflow" className="glass-panel float-up fade-delay-2 rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Workflow</p>
            <ol className="mt-3 space-y-3 text-sm text-(--muted)">
              <li>1. Start or resume a ChatView session in VS Code.</li>
              <li>2. Send prompts and actions from your phone.</li>
              <li>3. Watch commands execute on your workstation in real time.</li>
            </ol>
            <p className="mt-4 text-sm font-semibold text-(--success)">Never pause momentum.</p>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}
