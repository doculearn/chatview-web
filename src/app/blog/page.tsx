import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "ChatView Blog — coding from your phone, AI coding agents, mobile dev tools",
  description:
    "Field notes on coding from your phone, AI coding agents, Cursor, VS Code + GitHub Copilot, Claude Code, and building ChatView in public.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "ChatView Blog",
    description:
      "Coding from your phone, AI coding agents, and building ChatView in public.",
    url: "https://chat-view.xyz/blog",
  },
};

export default function BlogIndexPage() {
  return (
    <PageShell activePath="/blog">
      <section className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Blog</p>
        <h1 className="headline-glow mt-3 text-xl font-bold sm:text-3xl lg:text-4xl">
          Notes on coding from your phone
        </h1>
        <p className="mt-4 max-w-3xl text-(--muted)">
          Field reports on AI coding agents, mobile developer tools, the
          Cursor / VS Code / Copilot stack, and what we&apos;re learning
          building ChatView in public.
        </p>

        <div className="mt-8 space-y-4">
          {POSTS.map((post) => {
            const isExternal = Boolean(post.externalUrl);
            const titleNode = isExternal ? (
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-(--accent)"
              >
                {post.title}
                <span aria-hidden="true" className="ml-1">↗</span>
              </a>
            ) : (
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-(--accent)"
              >
                {post.title}
              </Link>
            );

            return (
              <article
                key={post.slug}
                className="feature-card flex flex-col gap-2 p-5 transition hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-3 text-xs text-(--muted)">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readMinutes} min read</span>
                  {isExternal ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="rounded-full border border-(--accent)/40 bg-(--accent)/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-(--accent)">
                        {post.externalLabel ?? "External"}
                      </span>
                    </>
                  ) : null}
                </div>
                <h2 className="text-lg font-semibold leading-snug sm:text-xl">
                  {titleNode}
                </h2>
                <p className="text-sm text-(--muted)">{post.description}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-(--muted)"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
