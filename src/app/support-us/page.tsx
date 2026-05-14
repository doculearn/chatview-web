import { PageShell } from "@/components/page-shell";
import { BuyCoffee } from "@/components/buy-coffee";

export const metadata = {
  title: "Support ChatView · Buy us a coffee",
  description:
    "ChatView is built by an indie hacker. Tip the project to help fund servers, features, and late-night commits.",
};

export default function SupportUsPage() {
  return (
    <PageShell activePath="/support-us">
      <BuyCoffee />
    </PageShell>
  );
}
