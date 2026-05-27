"use client";

import { TrackedLink } from "@/components/tracked-link";

const MARKETPLACE_URL =
  "https://marketplace.microsoft.com/en-us/product/saas/doculearn1773180431250.chatview?tab=Overview";

type Props = {
  location: string;
  className?: string;
};

export function MicrosoftMarketplaceCta({ location, className = "" }: Props) {
  return (
    <div
      className={`feature-card border border-white/15 p-5 sm:p-6 ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">
            Also available on
          </p>
          <h3 className="mt-1 text-lg font-semibold text-(--foreground)">
            Microsoft Marketplace
          </h3>
          <p className="mt-1 text-sm text-(--muted)">
            Bill ChatView through your existing Microsoft account — useful if
            your employer reimburses Azure spend.
          </p>
        </div>
        <TrackedLink
          href={MARKETPLACE_URL}
          location={location}
          target="microsoft_marketplace"
          event="microsoft_marketplace_click"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-(--accent) bg-(--panel-soft) px-5 py-3 text-sm font-semibold text-(--foreground) transition hover:border-(--accent-2) hover:bg-(--panel)"
        >
          <span
            aria-hidden="true"
            className="grid h-4 w-4 grid-cols-2 gap-[2px]"
          >
            <span className="bg-[#F25022]" />
            <span className="bg-[#7FBA00]" />
            <span className="bg-[#00A4EF]" />
            <span className="bg-[#FFB900]" />
          </span>
          Subscribe via Microsoft
        </TrackedLink>
      </div>
    </div>
  );
}
