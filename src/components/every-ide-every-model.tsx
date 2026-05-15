import Link from "next/link";

type Item = {
  label: string;
  hint?: string;
};

const IDES: Item[] = [
  { label: "VS Code", hint: "Official extension" },
  { label: "Cursor", hint: "VS Code-compatible" },
  { label: "Windsurf", hint: "VS Code-compatible" },
  { label: "JetBrains", hint: "Coming soon" },
  { label: "Vim / Neovim", hint: "CLI bridge" },
  { label: "Web IDE", hint: "Browser relay" },
];

const MODELS: Item[] = [
  { label: "GPT-5 / GPT-4o" },
  { label: "Claude Opus & Sonnet" },
  { label: "Gemini 2.5 Pro" },
  { label: "DeepSeek V3" },
  { label: "Llama 3 / Mistral" },
  { label: "Any OpenAI-compatible endpoint" },
];

const PLATFORMS: Item[] = [
  { label: "iOS" },
  { label: "Android" },
  { label: "Web" },
  { label: "Desktop (via VS Code)" },
];

export function EveryIdeEveryModel() {
  return (
    <section
      id="universal"
      className="glass-panel float-up mt-6 rounded-2xl p-4 sm:rounded-[2rem] sm:p-6 lg:p-10">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-(--muted)">
        <span className="rounded-full border border-(--line) bg-(--panel-soft) px-3 py-1">
          Bring your own model
        </span>
        <span className="rounded-full border border-(--line) bg-(--panel-soft) px-3 py-1">
          Every IDE
        </span>
        <span className="rounded-full border border-(--line) bg-(--panel-soft) px-3 py-1">
          Every platform
        </span>
      </div>

      <h2 className="headline-glow mt-4 max-w-3xl text-2xl font-bold leading-tight sm:text-4xl">
        Not locked to one IDE. Not locked to one model.
      </h2>

      <p className="mt-4 max-w-2xl text-base leading-7 text-(--muted) sm:text-lg">
        Mobile coding shouldn&apos;t mean ditching the editor you already love or the model that
        actually solves your bugs. ChatView relays prompts and commands from your phone to{" "}
        <span className="text-(--foreground)">whichever IDE you run</span> and{" "}
        <span className="text-(--foreground)">whichever model you pay for</span> — your keys, your
        choice, your workflow.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Pillar title="Works in your IDE" badge="IDE" items={IDES} />
        <Pillar title="Powered by your model" badge="MODEL" items={MODELS} />
        <Pillar title="From any device" badge="DEVICE" items={PLATFORMS} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-(--accent)/30 bg-(--accent)/5 px-4 py-3 text-sm">
        <span className="font-semibold text-(--accent)">No vendor lock-in.</span>
        <span className="text-(--muted)">
          One subscription, every editor, every model. $9.99/mo — cancel anytime.
        </span>
        <Link
          href="/register"
          className="ml-auto font-semibold text-(--foreground) underline-offset-4 hover:underline">
          Try it free →
        </Link>
      </div>
    </section>
  );
}

function Pillar({
  title,
  badge,
  items,
}: {
  title: string;
  badge: string;
  items: Item[];
}) {
  return (
    <div className="hero-stat h-full">
      <p className="font-mono text-xs text-(--accent-2)">{badge}</p>
      <p className="mt-2 text-lg font-semibold">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-(--foreground)">{item.label}</span>
            {item.hint ? (
              <span className="text-xs text-(--muted)">{item.hint}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
