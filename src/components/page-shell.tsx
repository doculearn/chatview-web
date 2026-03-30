import { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

type PageShellProps = {
  activePath: string;
  children: ReactNode;
};

export function PageShell({ activePath, children }: PageShellProps) {
  return (
    <div className="grid-overlay flex min-h-screen flex-1 px-4 py-8 sm:px-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <SiteHeader activePath={activePath} />
        {children}
      </main>
    </div>
  );
}
