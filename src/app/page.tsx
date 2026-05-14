import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { BuyCoffee } from "@/components/buy-coffee";

export default function Home() {
  return (
    <PageShell activePath="/">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section id="features" className="glass-panel float-up rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-(--muted)">
            <span className="rounded-full border border-(--line) bg-(--panel-soft) px-3 py-1">Build Without Stopping</span>
            <span className="rounded-full border border-(--line) bg-(--panel-soft) px-3 py-1">Phone to Workstation</span>
          </div>

          <h1 className="headline-glow mt-4 max-w-4xl text-2xl font-bold leading-[0.95] sm:mt-5 sm:text-4xl lg:text-6xl">
            Keep the repo moving even when you leave the desk.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-(--muted) sm:text-lg">
            Done for the day? Not quite. Walk away from your desk and keep shipping. Send prompts from mobile, execute commands on your
            workstation, and continue coding from anywhere in the world.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-(--accent)/30 bg-(--accent)/5 px-4 py-3 text-sm">
            <span className="font-semibold text-(--accent)">$9.99/mo</span>
            <span className="text-(--muted)">— full access, cancel anytime.</span>
            <Link href="/register" className="ml-auto font-semibold text-(--foreground) underline-offset-4 hover:underline">
              Get started →
            </Link>
          </div>

          <div className="mt-8 command-strip overflow-hidden p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-3">
              <div className="flex items-center gap-2">
                <span className="signal-dot bg-[#ff6b6b]" />
                <span className="signal-dot bg-[#ffd166]" />
                <span className="signal-dot bg-[#06d6a0]" />
              </div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-(--muted)">Active Relay Session</span>
            </div>
            <div className="mt-4 space-y-3 font-mono text-sm sm:text-[0.95rem]">
              <p className="text-(--accent-2)">$ chatview resume workstation-alpha</p>
              <p className="text-(--foreground)">Queued mobile prompt: <span className="text-(--muted)">&quot;Patch the failing auth flow and redeploy.&quot;</span></p>
              <p className="text-(--success)">relay status: connected • edits synced • terminal attached</p>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:mt-8 sm:gap-3 sm:grid-cols-3">
            <div className="hero-stat">
              <p className="font-mono text-xs text-(--accent-2)">REALTIME</p>
              <p className="mt-2 text-lg font-semibold">Live session relay</p>
              <p className="mt-1 text-sm text-(--muted)">Stream prompts and outputs without reopening your laptop.</p>
            </div>
            <div className="hero-stat">
              <p className="font-mono text-xs text-(--accent-2)">REMOTE EXEC</p>
              <p className="mt-2 text-lg font-semibold">Command-first control</p>
              <p className="mt-1 text-sm text-(--muted)">Kick off fixes, installs, and refactors straight from mobile.</p>
            </div>
            <div className="hero-stat">
              <p className="font-mono text-xs text-(--accent-2)">SESSION FLOW</p>
              <p className="mt-2 text-lg font-semibold">Context stays warm</p>
              <p className="mt-1 text-sm text-(--muted)">The mobile app and IDE share the same live execution thread.</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:mt-8 sm:gap-3 sm:flex-row">
            <Link
              href="https://marketplace.visualstudio.com/items?itemName=doculearn.chatview-relay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-5 py-3 font-semibold text-black transition hover:brightness-110"
            >
              Install VS Code Extension
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.chatviewmobile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) px-5 py-3 font-semibold text-(--foreground) transition hover:border-(--accent)"
            >
              Get it on Google Play
            </Link>
          </div>

          <a
            href="https://www.producthunt.com/products/chatview/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-chatview"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block sm:mt-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1220652&theme=light"
              alt="ChatView - Vibe Code from your Phone, from anywhere | Product Hunt"
              width={250}
              height={54}
              style={{ width: 250, height: 54 }}
            />
          </a>
        </section>

        <aside className="space-y-4 sm:space-y-6">
          <section id="connect" className="glass-panel feature-card-spotlight float-up fade-delay-1 rounded-2xl p-4 sm:rounded-[2rem] sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Security</p>
            <h2 className="mt-2 text-2xl font-semibold">Private by design</h2>
            <p className="mt-3 text-sm text-(--muted)">
              Your phone is the controller, your workstation is the execution engine. ChatView keeps prompts and workflows scoped to your
              authenticated account and active session.
            </p>
            <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-(--accent-2)">
              No public API sales messaging. Just secure, account-based product access.
            </p>

            <div className="mt-5 grid gap-3">
              <div className="feature-card">
                <p className="font-mono text-xs text-(--accent-2)">AUTH LAYER</p>
                <p className="mt-2 text-sm text-(--muted)">Credential-backed sessions with guarded routes and refresh-token retry flow.</p>
              </div>
              <div className="feature-card">
                <p className="font-mono text-xs text-(--accent-2)">RUNTIME</p>
                <p className="mt-2 text-sm text-(--muted)">Server-side relay endpoints keep backend keys out of the browser.</p>
              </div>
            </div>
          </section>

          <section id="workflow" className="glass-panel float-up fade-delay-2 rounded-2xl p-4 sm:rounded-[2rem] sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Workflow</p>
            <h2 className="mt-2 text-2xl font-semibold">Three beats. Zero context loss.</h2>
            <ol className="mt-5 space-y-3 text-sm text-(--muted)">
              <li className="feature-card">1. Start or resume a ChatView session in VS Code.</li>
              <li className="feature-card">2. Send prompts and actions from your phone.</li>
              <li className="feature-card">3. Watch commands execute on your workstation in real time.</li>
            </ol>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-(--success)">Never pause momentum.</p>
          </section>
        </aside>
      </div>
      <BuyCoffee />
    </PageShell>
  );
}
