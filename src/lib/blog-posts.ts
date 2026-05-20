export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  readMinutes: number;
  tags: string[];
  /** If set, the blog index links here instead of /blog/{slug} —
   *  used for cross-posted pieces hosted on Medium / dev.to / Hashnode
   *  so the index can still surface them without us re-hosting the body. */
  externalUrl?: string;
  /** Display label for external posts, e.g. "Medium". Falls back to
   *  the URL hostname if omitted. */
  externalLabel?: string;
};

// Order = newest first. Add a new post above the previous entries.
export const POSTS: BlogPost[] = [
  {
    slug: "vibe-code-from-your-phone-day-12-medium",
    title: "Vibe code from your phone: what 12 days of launching ChatView taught me",
    description:
      "Day 12 of building ChatView in public — 6 users, 1 paying customer, $9.99 MRR. The honest numbers, the bug we patched in 40 minutes, and three things I’d do differently. Hosted on Medium.",
    publishedAt: "2026-05-20",
    readMinutes: 7,
    tags: ["build in public", "vibe coding", "indie hacker", "product hunt", "mobile coding"],
    externalUrl:
      "https://medium.com/@williammabotjaeng/vibe-code-from-your-phone-what-12-days-of-launching-chatview-taught-me-24d06459f459",
    externalLabel: "Medium",
  },
  {
    slug: "top-5-vibe-coding-from-your-phone-apps-2026",
    title: "Top 5 apps for vibe coding from your phone in 2026",
    description:
      "We ranked the five real ways developers ship code from a phone in 2026: ChatView, Cursor Mobile, GitHub Mobile + Codespaces, Termux + Claude Code, and Replit Mobile. Trade-offs, costs (ChatView from $9.99/month), and which one is right for you.",
    publishedAt: "2026-05-19",
    readMinutes: 6,
    tags: ["mobile coding", "AI coding agents", "Cursor", "Claude Code", "VS Code"],
  },
  {
    slug: "vibe-coding-from-your-phone-without-spinning-up-a-linode",
    title: "Vibe coding from your phone, without spinning up a Linode",
    description:
      "A reply to Oakley Hall's softball-bleacher coding setup — and the simpler path that doesn't require Linode, SSH keys, or Terminus. Three setups for coding from your phone, ranked by DevOps cost.",
    publishedAt: "2026-05-19",
    readMinutes: 5,
    tags: ["mobile coding", "vibe coding", "Claude Code", "Cursor mobile", "developer productivity"],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
