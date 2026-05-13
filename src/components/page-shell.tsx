import { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

type PageShellProps = {
  activePath: string;
  children: ReactNode;
};

export function PageShell({ activePath, children }: PageShellProps) {
  return (
    <div className="grid-overlay flex min-h-screen flex-1 px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-6">
        <SiteHeader activePath={activePath} />
        {children}
        <footer className="pb-2 pt-1 text-center text-xs uppercase tracking-[0.16em] text-(--muted)">
          <span>ChatView &copy; 2026</span>
          <span className="mx-2">·</span>
          <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-(--foreground)">Privacy Policy</Link>
          <span className="mx-2">·</span>
          <Link href="/terms-of-service" className="underline underline-offset-4 hover:text-(--foreground)">Terms of Service</Link>
          <span className="mx-2">·</span>
          <Link href="/support" className="underline underline-offset-4 hover:text-(--foreground)">Support</Link>
        </footer>
      </main>
    </div>
  );
}
