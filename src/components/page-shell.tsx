import { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { CookieSettingsLink } from "@/components/cookie-consent";

type PageShellProps = {
  activePath: string;
  children: ReactNode;
};

export function PageShell({ activePath, children }: PageShellProps) {
  return (
    <div className="grid-overlay flex min-h-screen flex-1">
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-3 sm:gap-6 sm:px-6">
        <SiteHeader activePath={activePath} />
        {children}
        <footer className="pb-2 pt-1 text-center text-xs uppercase tracking-[0.16em] text-(--muted)">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-4">
            <TrackedLink
              href="https://openhunts.com"
              location="footer_badges"
              target="openhunts"
              title="OpenHunts Club"
              className="inline-block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://cdn.openhunts.com/badges/club.webp"
                alt="OpenHunts Club Member"
                width={195}
                height={42}
                style={{ width: 195, height: "auto" }}
              />
            </TrackedLink>
            <TrackedLink
              href="https://nicklaunches.com/products/chatview/?utm_source=chat-view.xyz&utm_medium=badge&utm_campaign=featured"
              location="footer_badges"
              target="nick_launches"
              className="inline-block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://nicklaunches.com/badges/featured-dark.svg"
                alt="ChatView on Nick Launches"
                width={244}
                height={56}
              />
            </TrackedLink>
            <TrackedLink
              href="https://huzzler.so/products/xqSH9lOK6m/chatview?utm_source=huzzler_product_website&utm_medium=badge&utm_campaign=free_listing"
              location="footer_badges"
              target="huzzler"
              className="inline-block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://huzzler.so/assets/images/embeddable-badges/featured.png"
                alt="Huzzler Embed Badge"
                width={159}
                height={55}
              />
            </TrackedLink>
            <TrackedLink
              href="https://startupfa.me/s/chat-view.xyz-590?utm_source=chat-view.xyz"
              location="footer_badges"
              target="startup_fame"
              className="inline-block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://startupfa.me/badges/featured-badge.webp"
                alt="ChatView - Featured on Startup Fame"
                width={171}
                height={54}
              />
            </TrackedLink>
            <TrackedLink
              href="https://www.tinystartups.com/startup/chatview"
              location="footer_badges"
              target="tiny_startups"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 22px 14px 18px",
                borderRadius: 14,
                textDecoration: "none",
                fontFamily: "'Inter', system-ui, sans-serif",
                background:
                  "linear-gradient(#fff,#fff) padding-box, linear-gradient(90deg,#3525E6,#D81FE0,#22B8F0) border-box",
                border: "2px solid transparent",
                color: "#0E0B1F",
              }}
            >
              <svg width="56" height="56" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="tsg" x1="0.1" y1="0" x2="0.9" y2="1">
                    <stop offset="0%" stopColor="#3525E6" />
                    <stop offset="55%" stopColor="#D81FE0" />
                    <stop offset="100%" stopColor="#22B8F0" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 6C52 32 68 48 94 50C68 52 52 68 50 94C48 68 32 52 6 50C32 48 48 32 50 6Z"
                  fill="url(#tsg)"
                />
              </svg>
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.15,
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#6A6585",
                  }}
                >
                  Launched on
                </span>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Tiny Startups
                </span>
                <span
                  style={{ fontSize: 11, color: "#6A6585", marginTop: 4 }}
                >
                  tinystartups.com
                </span>
              </span>
            </TrackedLink>
          </div>
          <div>
          <span>ChatView &copy; 2026</span>
          <span className="mx-2">·</span>
          <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-(--foreground)">Privacy Policy</Link>
          <span className="mx-2">·</span>
          <Link href="/terms-of-service" className="underline underline-offset-4 hover:text-(--foreground)">Terms of Service</Link>
          <span className="mx-2">·</span>
          <Link href="/support" className="underline underline-offset-4 hover:text-(--foreground)">Support</Link>
          <span className="mx-2">·</span>
          <Link href="/support-us" className="underline underline-offset-4 hover:text-(--foreground)">Buy us a coffee ☕</Link>
          <span className="mx-2">·</span>
          <CookieSettingsLink className="uppercase tracking-[0.16em] underline underline-offset-4 hover:text-(--foreground)" />
          </div>
        </footer>
      </main>
    </div>
  );
}
