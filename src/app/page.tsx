import Image from "next/image";

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_CHATVIEW_API_URL ?? "https://api.chat-view.xyz/api/v1";

  return (
    <div className="grid-overlay flex min-h-screen flex-1 items-center justify-center px-4 py-10 sm:px-8">
      <main className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="glass-panel float-up rounded-3xl p-6 sm:p-10">
          <div className="mb-6 flex items-center gap-4">
            <Image
              src="/chatview-logo.png"
              alt="ChatView"
              width={64}
              height={64}
              className="h-14 w-14 rounded-2xl border border-white/10"
              priority
            />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">ChatView Web Frontend</p>
              <h1 className="headline-glow text-2xl font-bold sm:text-3xl">Vibe Coding From Your Phone</h1>
            </div>
          </div>

          <p className="max-w-2xl text-base leading-7 text-(--muted) sm:text-lg">
            Walk away from your desk and keep shipping. ChatView lets you send prompts from mobile, execute commands on your workstation,
            and continue coding from anywhere in the world.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-mono text-xs text-(--accent-2)">REALTIME</p>
              <p className="mt-1 text-sm text-(--muted)">Live session updates via Web PubSub</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-mono text-xs text-(--accent-2)">REMOTE EXEC</p>
              <p className="mt-1 text-sm text-(--muted)">Run commands and edit files from your phone</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-mono text-xs text-(--accent-2)">SESSION FLOW</p>
              <p className="mt-1 text-sm text-(--muted)">Keep context synced between app and IDE</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://marketplace.visualstudio.com/items?itemName=doculearn.chatview-relay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-5 py-3 font-semibold text-black transition hover:brightness-110"
            >
              Install VS Code Extension
            </a>
            <a
              href="https://github.com/doculearn/chatview-mobile/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) px-5 py-3 font-semibold text-(--foreground) transition hover:border-(--accent)"
            >
              Download Mobile APK
            </a>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="glass-panel float-up fade-delay-1 rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Connect</p>
            <h2 className="mt-2 text-xl font-semibold">API Endpoint</h2>
            <p className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-sm text-(--accent-2)">{apiUrl}</p>
            <p className="mt-3 text-sm text-(--muted)">
              Set a custom backend at build time with <span className="font-mono">NEXT_PUBLIC_CHATVIEW_API_URL</span>.
            </p>
          </section>

          <section className="glass-panel float-up fade-delay-2 rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Workflow</p>
            <ol className="mt-3 space-y-3 text-sm text-(--muted)">
              <li>1. Start or resume a ChatView session in VS Code.</li>
              <li>2. Send prompts and actions from your phone.</li>
              <li>3. Watch commands execute on your workstation in real time.</li>
            </ol>
            <p className="mt-4 text-sm font-semibold text-(--success)">Never pause momentum.</p>
          </section>
        </aside>
      </main>
    </div>
  );
}
