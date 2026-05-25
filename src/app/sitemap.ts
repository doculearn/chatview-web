import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog-posts";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://chat-view.xyz";

type Route = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

// Public, indexable routes only. Auth-walled (account, support tickets,
// developer), dynamic ([id]), client-side flows marked noindex (login,
// register, qr, marketplace/landing), and post-checkout callback pages
// are deliberately excluded.
const ROUTES: Route[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/download", changeFrequency: "weekly", priority: 0.9 },
  { path: "/docs", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/beta-signup", changeFrequency: "monthly", priority: 0.7 },
  { path: "/support", changeFrequency: "monthly", priority: 0.5 },
  { path: "/support-us", changeFrequency: "monthly", priority: 0.4 },
  { path: "/coffee", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-statement", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticEntries: MetadataRoute.Sitemap = ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${BASE_URL}${path === "/" ? "" : path}`,
      lastModified,
      changeFrequency,
      priority,
    }),
  );
  const blogEntries: MetadataRoute.Sitemap = POSTS
    // Exclude posts whose canonical lives off-site (e.g. Medium). The slug
    // route doesn't render a page for them, so including them in the
    // sitemap produces a 4XX. Their canonical link is the externalUrl,
    // which is already discoverable from /blog.
    .filter((post) => !post.externalUrl)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  return [...staticEntries, ...blogEntries];
}


