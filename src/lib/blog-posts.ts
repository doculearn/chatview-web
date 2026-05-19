export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  readMinutes: number;
  tags: string[];
};

// Order = newest first. Add a new post above the previous entries.
export const POSTS: BlogPost[] = [
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
