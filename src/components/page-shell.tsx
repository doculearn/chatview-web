import { ReactNode } from "react";
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
          Doculearn &copy; 2026
        </footer>
      </main>
    </div>
  );
}
