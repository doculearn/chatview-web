"use client";

/**
 * Anchor / Link wrapper that fires a `cta_clicked` analytics event on
 * click. Use for any link we want to measure conversion on — hero
 * buttons, launch-site badges, footer links.
 *
 * Internal hrefs (starting with `/`) render as `next/link` so they keep
 * SPA-style client navigation. External hrefs render as a plain `<a>`
 * with `target="_blank"` + `rel="noopener noreferrer"` by default.
 */

import Link from "next/link";
import { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { track } from "@/lib/cv-analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick" | "target"> & {
  href: string;
  /** Where on the page the CTA lives — e.g. "hero", "footer", "blog_cta". */
  location: string;
  /** What the user is going to — e.g. "register", "youtube_demo",
   *  "fazier_badge". Keep short / snake_case so the dashboard groups
   *  similar buttons together. */
  target: string;
  /** Native anchor target attribute (e.g. "_blank"). Defaults to
   *  "_blank" for external links. */
  htmlTarget?: string;
  /** Extra props recorded alongside the event. */
  extra?: Record<string, unknown>;
  children: ReactNode;
};

export function TrackedLink({
  href,
  location,
  target,
  htmlTarget,
  extra,
  children,
  ...rest
}: Props) {
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    track("cta_clicked", { location, target, href, ...(extra || {}) });
    rest.onMouseDown?.(e as never);
  }

  if (isInternal) {
    return (
      <Link href={href} {...rest} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  // External by default: open in a new tab, drop opener.
  return (
    <a
      href={href}
      {...rest}
      target={htmlTarget ?? "_blank"}
      rel={rest.rel ?? "noopener noreferrer"}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
