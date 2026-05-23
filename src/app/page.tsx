import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { BuyCoffee } from "@/components/buy-coffee";
import { EveryIdeEveryModel } from "@/components/every-ide-every-model";
import { TrackedLink } from "@/components/tracked-link";
import { TrackPageView } from "@/components/track-page-view";

type Highlight = { title: string; description: string };

type Billboard = {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  highlights: Highlight[];
  visual: React.ReactNode;
  direction: "left" | "right";
};

const BILLBOARDS: Billboard[] = [
  {
    id: "drive",
    eyebrow: "Drive your agent",
    direction: "left",
    title: (
      <>
        Drive <span className="text-(--accent)">VS Code, Claude Code & Cursor</span> from your phone.
      </>
    ),
    description:
      "ChatView is the mobile remote for every coding agent you already use. Queue prompts on the train, watch your agent ship in your real repo, approve or cancel runs from the lock screen.",
    highlights: [
      { title: "Bring your own CLI", description: "VS Code Copilot, Claude Code, Codex CLI, Cursor Agent, Aider, Cline/Roo — anything you can run in a terminal." },
      { title: "Approval gates", description: "Review tool calls and diffs from mobile before they touch your repo." },
      { title: "Resumable sessions", description: "Pick up the same agent thread on phone, web, or back at your desk." },
    ],
    visual: (
      <div className="command-strip overflow-hidden p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-3">
          <div className="flex items-center gap-2">
            <span className="signal-dot bg-[#ff6b6b]" />
            <span className="signal-dot bg-[#ffd166]" />
            <span className="signal-dot bg-[#06d6a0]" />
          </div>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-(--muted)">claude code · iphone</span>
        </div>
        <div className="mt-4 space-y-2 font-mono text-sm">
          <p className="text-(--accent-2)">$ chatview attach workstation-alpha</p>
          <p className="text-(--muted)">→ relay connected · agent: claude-code · model: opus-4.7</p>
          <p className="text-(--foreground)">prompt: fix the failing auth test and open a PR</p>
          <p className="text-(--success)">✓ tests green · PR #482 opened</p>
        </div>
      </div>
    ),
  },
  {
    id: "ide",
    eyebrow: "Inside your IDE",
    direction: "right",
    title: (
      <>
        Lives in <span className="text-(--accent)">VS Code, Cursor & Windsurf</span>.
      </>
    ),
    description:
      "Install the ChatView relay extension once. Every prompt from mobile lands in the same editor session you'd use at your desk — same workspace, same files, same agent.",
    highlights: [
      { title: "VS Code marketplace", description: "Official extension, also works in Cursor and Windsurf with zero config." },
      { title: "JetBrains & Vim", description: "Terminal bridge for IntelliJ, PyCharm, Neovim, and tmux setups." },
      { title: "Web IDE relay", description: "Browser fallback when you don't have your laptop with you." },
    ],
    visual: (
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "VS Code", hint: "Official" },
          { label: "Cursor", hint: "Compatible" },
          { label: "Windsurf", hint: "Compatible" },
          { label: "JetBrains", hint: "Bridge" },
          { label: "Vim / Neovim", hint: "Terminal" },
          { label: "Web IDE", hint: "Browser" },
        ].map((ide) => (
          <div key={ide.label} className="feature-card">
            <p className="font-mono text-xs text-(--accent-2)">{ide.hint.toUpperCase()}</p>
            <p className="mt-1 text-sm font-semibold">{ide.label}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "model",
    eyebrow: "On your model",
    direction: "left",
    title: (
      <>
        Pay for the model <span className="text-(--accent)">once</span>. Use it everywhere.
      </>
    ),
    description:
      "Your API keys, your subscriptions, your laptop. ChatView never resells inference — it relays your prompts to whatever model your agent is already configured to use, on hardware you control.",
    highlights: [
      { title: "Bring your own keys", description: "Anthropic, OpenAI, Google, DeepSeek, or any OpenAI-compatible endpoint." },
      { title: "No prompt resale", description: "We don't proxy or store your prompts. Relay only." },
      { title: "Local execution", description: "Code runs on your workstation. Secrets never leave your machine." },
    ],
    visual: (
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        {[
          "claude-opus-4.7",
          "gpt-5",
          "gemini-2.5-pro",
          "deepseek-v3",
          "llama-3.3-70b",
          "qwen-2.5-coder",
        ].map((m) => (
          <div key={m} className="rounded-lg border border-(--line) bg-(--panel-soft) px-3 py-2 text-(--foreground)">
            {m}
          </div>
        ))}
      </div>
    ),
  },
];

const STEPS = [
  { n: 1, title: "Install the relay", body: "Add the ChatView extension to VS Code, Cursor, or Windsurf. One click, no YAML." },
  { n: 2, title: "Pair your phone", body: "Scan the QR code from the mobile app. Your workstation is now your agent's body." },
  { n: 3, title: "Pick your agent", body: "VS Code Copilot, Claude Code, Codex CLI, Cursor Agent — whatever you already pay for." },
  { n: 4, title: "Ship from anywhere", body: "Queue prompts, watch diffs, approve commits, merge PRs — all from your phone." },
];

export default function Home() {
  return (
    <PageShell activePath="/">      <TrackPageView event="landing_viewed" />      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section id="hero" className="glass-panel float-up p-5 sm:p-10 lg:p-14">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-[0.24em] text-(--muted)">
            <span className="rounded-full border border-(--accent)/40 bg-(--accent)/10 px-3 py-1 text-(--accent)">Codex Mobile for every agent</span>
            <span className="rounded-full border border-(--line) bg-(--panel-soft) px-3 py-1">Every IDE</span>
            <span className="rounded-full border border-(--line) bg-(--panel-soft) px-3 py-1">Every model</span>
          </div>

          <h1 className="headline-glow mt-5 text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Codex Mobile, but for{" "}
            <span className="bg-gradient-to-r from-(--accent) to-(--accent-2) bg-clip-text text-transparent">
              VS Code, Claude Code, Codex & Cursor.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-(--muted) sm:text-lg">
            Drive your coding agent from your phone. Runs in your real IDE on your real laptop,
            powered by whichever model you actually pay for. Stop pausing momentum just because you walked away from the desk.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
            <TrackedLink
              href="/register"
              location="hero"
              target="register"
              className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-6 py-3 font-semibold text-black shadow-lg shadow-(--accent)/20 transition hover:brightness-110"
            >
              Start Building →
            </TrackedLink>
            <TrackedLink
              href="https://www.youtube.com/watch?v=9matVuaMesw"
              location="hero"
              target="youtube_demo"
              className="inline-flex items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) px-6 py-3 font-semibold text-(--foreground) transition hover:border-(--accent)"
            >
              ▶ Watch the Demo
            </TrackedLink>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-(--muted)">
            <span>$9.99 / month</span>
            <span aria-hidden>·</span>
            <span>Cancel anytime</span>
            <span aria-hidden>·</span>
            <span>Your keys, your laptop, your repo</span>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.producthunt.com/products/chatview/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-chatview"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1220652&theme=light"
                alt="ChatView on Product Hunt"
                width={250}
                height={54}
                style={{ width: 250, height: 54 }}
              />
            </a>
            <a
              href="https://fazier.com/launches/chatview-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://fazier.com/api/v1/public/badges/embed_image.svg?launch_id=9306&badge_type=daily&theme=light"
                alt="ChatView on Fazier"
                width={270}
                height={54}
                style={{ width: 270, height: 54 }}
              />
            </a>
          </div>
        </div>

        {/* hero stats strip */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="hero-stat">
            <p className="font-mono text-xs text-(--accent-2)">REALTIME</p>
            <p className="mt-2 text-lg font-semibold">Live session relay</p>
            <p className="mt-1 text-sm text-(--muted)">Stream prompts and outputs without reopening your laptop.</p>
          </div>
          <div className="hero-stat">
            <p className="font-mono text-xs text-(--accent-2)">REMOTE EXEC</p>
            <p className="mt-2 text-lg font-semibold">Command-first control</p>
            <p className="mt-1 text-sm text-(--muted)">Kick off fixes, installs and refactors straight from mobile.</p>
          </div>
          <div className="hero-stat">
            <p className="font-mono text-xs text-(--accent-2)">CONTEXT</p>
            <p className="mt-2 text-lg font-semibold">Sessions stay warm</p>
            <p className="mt-1 text-sm text-(--muted)">The mobile app and IDE share one live execution thread.</p>
          </div>
        </div>
      </section>

      {/* ─── BILLBOARDS ───────────────────────────────────────────────── */}
      <section id="features" className="mt-10 space-y-10 sm:mt-16 sm:space-y-16">
        {BILLBOARDS.map((b, i) => (
          <div
            key={b.id}
            className={`glass-panel float-up fade-delay-${(i % 3) + 1} grid gap-6 rounded-2xl p-5 sm:rounded-[2rem] sm:p-10 lg:grid-cols-2 lg:gap-10`}
          >
            <div className={b.direction === "right" ? "lg:order-2" : ""}>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-(--accent)">{b.eyebrow}</p>
              <h2 className="mt-3 text-2xl font-bold leading-[1.1] sm:text-3xl lg:text-4xl">{b.title}</h2>
              <p className="mt-4 text-base text-(--muted) sm:text-lg">{b.description}</p>
              <ul className="mt-6 space-y-3">
                {b.highlights.map((h) => (
                  <li key={h.title} className="feature-card">
                    <p className="text-sm font-semibold text-(--foreground)">{h.title}</p>
                    <p className="mt-1 text-sm text-(--muted)">{h.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`flex items-center ${b.direction === "right" ? "lg:order-1" : ""}`}>
              <div className="w-full">{b.visual}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="mt-10 sm:mt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-(--accent)">Zero setup</p>
          <h2 className="headline-glow mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
            Install once. Ship from your phone forever.
          </h2>
          <p className="mt-4 text-base text-(--muted) sm:text-lg">
            No new agent to learn, no proxy to configure, no prompts leaving your laptop.
            ChatView is a relay — not a replacement.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="glass-panel feature-card-spotlight float-up rounded-2xl p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--accent)/15 font-mono text-base font-bold text-(--accent)">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-(--muted)">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing" className="mt-10 sm:mt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-(--accent)">Pricing</p>
          <h2 className="headline-glow mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
            One price. Every agent. Every IDE. Every model.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="glass-panel feature-card-spotlight rounded-2xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-(--accent)">ChatView Pro</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">$9.99</span>
              <span className="text-(--muted)">/ month</span>
            </div>
            <p className="mt-3 text-sm text-(--muted)">Everything you need to ship from your phone. Cancel anytime.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {[
                "Unlimited mobile-to-IDE relay sessions",
                "Works with VS Code Copilot, Claude Code, Codex CLI, Cursor",
                "VS Code, Cursor, Windsurf extensions included",
                "Bring your own model & API keys",
                "Voice prompts on iOS & Android",
                "Email support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 text-(--success)">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <TrackedLink
              href="/register"
              location="pricing_pro_card"
              target="register"
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-(--accent) px-5 py-3 font-semibold text-black transition hover:brightness-110"
            >
              Start Building →
            </TrackedLink>
          </div>

          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Team / Enterprise</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">Custom</span>
            </div>
            <p className="mt-3 text-sm text-(--muted)">SSO, audit logs, on-prem relay, and shared workstation pools.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {[
                "Everything in Pro",
                "SAML / SCIM single sign-on",
                "Self-hosted relay (on-prem or VPC)",
                "Shared workstation pools",
                "Admin audit log + usage analytics",
                "Priority support + SLA",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 text-(--success)">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <TrackedLink
              href="/support"
              location="pricing_team_card"
              target="contact_sales"
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) px-5 py-3 font-semibold text-(--foreground) transition hover:border-(--accent)"
            >
              Contact sales
            </TrackedLink>
          </div>
        </div>
      </section>

      <EveryIdeEveryModel />

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section id="cta" className="mt-10 sm:mt-16">
        <div className="glass-panel float-up rounded-2xl p-6 text-center sm:rounded-[2rem] sm:p-12">
          <h2 className="headline-glow text-2xl font-bold sm:text-4xl">
            Your agent is waiting. Your phone is already in your hand.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-(--muted) sm:text-lg">
            Install the VS Code extension, scan the QR with the mobile app, and ship the next PR from the supermarket queue.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TrackedLink
              href="https://marketplace.visualstudio.com/items?itemName=doculearn.chatview-relay"
              location="bottom_cta"
              target="vscode_marketplace"
              className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-6 py-3 font-semibold text-black transition hover:brightness-110"
            >
              Install VS Code Extension
            </TrackedLink>
            <TrackedLink
              href="https://play.google.com/store/apps/details?id=com.chatviewmobile"
              location="bottom_cta"
              target="google_play"
              className="inline-flex items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) px-6 py-3 font-semibold text-(--foreground) transition hover:border-(--accent)"
            >
              Get it on Google Play
            </TrackedLink>
          </div>
        </div>
      </section>

      <BuyCoffee />
    </PageShell>
  );
}
