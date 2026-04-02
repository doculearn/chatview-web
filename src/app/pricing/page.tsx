import { PageShell } from "@/components/page-shell";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";

export default function PricingPage() {
  return (
    <PageShell activePath="/pricing">
      <SubscriptionManager />
    </PageShell>
  );
}
