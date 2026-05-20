"use client";

/**
 * Fires a named funnel event exactly once when mounted. Lets server
 * components opt into named-step tracking without becoming client
 * components themselves — e.g. the marketing homepage renders
 * <TrackPageView event="landing_viewed" /> at the top of its tree
 * and `landing_viewed` shows up in GA4 + Usermaven on every visit.
 *
 * Don't use this for events that fire from user interaction — those
 * should call `track()` directly from a `"use client"` component so
 * the props can be derived from the interaction itself.
 */

import { useEffect } from "react";
import { track, type FunnelEvent } from "@/lib/cv-analytics";

type Props = {
  event: FunnelEvent | string;
  props?: Record<string, unknown>;
};

export function TrackPageView({ event, props }: Props) {
  useEffect(() => {
    track(event, props);
    // We intentionally fire once per mount — re-running on prop changes
    // would inflate counts when callers pass inline object literals.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
