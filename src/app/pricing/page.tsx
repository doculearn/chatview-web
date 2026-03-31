import { PageShell } from "@/components/page-shell";

const plans = [
  {
    name: "Standard",
    price: "USD 19",
    cadence: "per month",
    features: ["Unlimited sessions", "Priority sync", "Prompt templates", "Device history"],
    highlight: true,
  },
  {
    name: "Team",
    price: "Coming Soon",
    cadence: "under construction",
    features: ["Shared workspaces", "Role controls", "Audit trail", "Enterprise onboarding"],
    disabled: true,
  },
];

export default function PricingPage() {
  return (
    <PageShell activePath="/pricing">
      <section className="glass-panel float-up rounded-3xl p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Pricing</p>
        <h1 className="headline-glow mt-3 text-3xl font-bold sm:text-4xl">Pick Your Vibe Coding Plan</h1>
        <p className="mt-4 max-w-3xl text-(--muted)">
          One production package today: USD 19/month. Team package is under construction and coming soon.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`feature-card p-5 ${plan.highlight ? "border-(--accent) shadow-[0_0_30px_rgba(26,166,255,0.22)]" : ""}`}
            >
              <p className="text-sm font-semibold text-(--accent-2)">{plan.name}</p>
              <p className="mt-2 text-3xl font-bold">{plan.price}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">{plan.cadence}</p>
              <ul className="mt-4 space-y-2 text-sm text-(--muted)">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              <button
                className="mt-5 w-full rounded-xl bg-(--panel-soft) px-4 py-2 text-sm font-semibold hover:border hover:border-(--accent) disabled:cursor-not-allowed disabled:opacity-60"
                disabled={Boolean(plan.disabled)}
              >
                {plan.disabled ? "Under Construction" : "Choose Standard"}
              </button>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
