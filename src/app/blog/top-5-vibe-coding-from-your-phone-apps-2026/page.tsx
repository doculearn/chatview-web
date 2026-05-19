import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getPost } from "@/lib/blog-posts";

const SLUG = "top-5-vibe-coding-from-your-phone-apps-2026";
const post = getPost(SLUG)!;
const URL = `https://chat-view.xyz/blog/${SLUG}`;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  keywords: [
    "vibe coding from phone",
    "best mobile coding apps 2026",
    "Cursor mobile",
    "Codex Mobile",
    "Claude Code mobile",
    "GitHub Codespaces mobile",
    "Replit mobile",
    "Termius coding",
    "AI coding agent mobile",
    "code from your phone",
  ],
  alternates: { canonical: `/blog/${SLUG}` },
  openGraph: {
    type: "article",
    url: URL,
    title: post.title,
    description: post.description,
    publishedTime: post.publishedAt,
    authors: ["William Mabotja"],
    tags: post.tags,
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.description,
  },
};

export default function Page() {
  return (
    <PageShell activePath="/blog">
      <article className="glass-panel float-up rounded-2xl p-5 sm:rounded-3xl sm:p-8 lg:p-12">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Roundup</p>
        <h1 className="headline-glow mt-3 text-2xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-xs text-(--muted)">
          <time dateTime={post.publishedAt}>May 19, 2026</time>
          <span aria-hidden="true">·</span>
          <span>{post.readMinutes} min read</span>
          <span aria-hidden="true">·</span>
          <span>William Mabotja</span>
        </div>

        <div className="prose-blog mt-8 max-w-3xl space-y-5 text-base leading-7 text-(--foreground)">
          <p>
            &ldquo;Vibe coding from your phone&rdquo; sounds like a meme until
            you have three kids, a one-hour commute, or a Sentry alert that
            pings while you&apos;re in line for coffee. In 2026 the AI
            coding-agent boom made this real: you don&apos;t need a keyboard
            to prompt, review, and approve edits. You just need the right
            tool on your phone.
          </p>
          <p>
            We tested every serious option. Here are the five that actually
            let you ship code from a phone in 2026 — ranked by how little
            DevOps they ask of you.
          </p>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            1. ChatView — mobile remote for Cursor, VS Code, Claude Code, Codex
          </h2>
          <p>
            <strong>Best for:</strong> Developers who already use Cursor or
            VS Code with Copilot / Claude Code / Codex on their laptop and
            want to drive those agents from their phone.
          </p>
          <p>
            ChatView is a VS Code / Cursor extension plus a mobile app. You
            pair them by scanning a QR code, then your phone becomes a
            remote control for whatever coding agent is configured in your
            editor. Streamed diffs appear on your phone in real time. Tap
            to approve, tap to reject. Your laptop runs the agent. Your
            existing subscription does the inference.
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong>Setup:</strong> ~60 seconds. Install the extension,
              scan the QR.
            </li>
            <li>
              <strong>Pricing:</strong> Plans start at $9.99/month for
              unlimited prompts and multi-device pairing.
            </li>
            <li>
              <strong>Works with:</strong> Cursor, VS Code + GitHub
              Copilot, Claude Code, Codex.
            </li>
            <li>
              <strong>Privacy:</strong> End-to-end encrypted relay. Your
              code never sits on our servers.
            </li>
          </ul>
          <p>
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-(--accent)"
            >
              Try ChatView →
            </Link>
          </p>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            2. Codex Mobile (formerly Cursor Mobile)
          </h2>
          <p>
            <strong>Best for:</strong> Cursor users who want a first-party
            mobile experience and don&apos;t mind running a separate model
            config in the cloud.
          </p>
          <p>
            Anysphere&apos;s native mobile app. Slick UI, prompt-and-watch
            flow, integrates with their cloud agent infrastructure. The
            trade-off is that it&apos;s a Cursor-only world — if you live
            in VS Code, Copilot, or any other agent stack, you&apos;re
            outside their loop.
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong>Setup:</strong> ~2 minutes. Sign in with your Cursor
              account.
            </li>
            <li>
              <strong>Pricing:</strong> Bundled with Cursor Pro
              (~$20/month).
            </li>
            <li>
              <strong>Works with:</strong> Cursor only.
            </li>
            <li>
              <strong>Trade-off:</strong> Cloud agent runs in their
              infrastructure, not your laptop — fine for most cases, less
              so if you have proprietary code or air-gapped repos.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            3. GitHub Mobile + Codespaces
          </h2>
          <p>
            <strong>Best for:</strong> Microsoft-ecosystem developers
            already living in GitHub and Codespaces.
          </p>
          <p>
            GitHub Mobile lets you open Codespaces from your phone, run
            Copilot Chat against your repo, and review/approve PRs. With
            Copilot Agent now GA, you can kick off agent tasks in the
            cloud from anywhere. The UX is best in class for what it is —
            a mobile shell on a cloud dev environment.
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong>Setup:</strong> ~5 minutes. Provision a Codespace,
              install GitHub Mobile.
            </li>
            <li>
              <strong>Pricing:</strong> Codespaces metered against your
              GitHub plan + Copilot subscription ($10–39/month).
            </li>
            <li>
              <strong>Works with:</strong> GitHub repos + Copilot.
            </li>
            <li>
              <strong>Trade-off:</strong> Codespaces is a separate dev
              environment, not your laptop. Your laptop&apos;s checkout,
              extensions, and config don&apos;t come with you.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            4. Termius + Claude Code on a VPS
          </h2>
          <p>
            <strong>Best for:</strong> Terminal-native developers who
            don&apos;t mind setting up a $5/month Linode and managing SSH
            keys.
          </p>
          <p>
            The Oakley Hall setup, popularized by his April 2025 Medium
            post. Spin up a VPS, install Claude Code (or Aider, or Codex),
            generate SSH keys, add them to GitHub. Connect from your phone
            with Termius, Blink, or Termux.
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong>Setup:</strong> 30 minutes to 3 hours the first time.
            </li>
            <li>
              <strong>Pricing:</strong> $5–10/month VPS + $10/month
              Termius + your agent&apos;s API or subscription.
            </li>
            <li>
              <strong>Works with:</strong> Any CLI-based agent.
            </li>
            <li>
              <strong>Trade-off:</strong> Everything is terminal text —
              you lose the streamed-diff UX that GUI tools give you. Your
              VPS git checkout is a separate copy from your laptop.
            </li>
          </ul>
          <p>
            See our companion post:{" "}
            <Link
              href="/blog/vibe-coding-from-your-phone-without-spinning-up-a-linode"
              className="underline underline-offset-4 hover:text-(--accent)"
            >
              Vibe coding from your phone, without spinning up a Linode →
            </Link>
          </p>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            5. Replit Mobile
          </h2>
          <p>
            <strong>Best for:</strong> Hobbyists, students, and
            quick-prototypers who want a self-contained mobile coding
            environment.
          </p>
          <p>
            Replit&apos;s mobile app is the most polished &ldquo;IDE on
            your phone&rdquo; experience available. Full editor, agent
            integration, instant deploys. It&apos;s a different category
            from the rest of this list — you&apos;re not driving your
            existing IDE, you&apos;re using a new one.
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong>Setup:</strong> ~2 minutes. Install the app, sign
              in.
            </li>
            <li>
              <strong>Pricing:</strong> Free tier; Hacker tier $7/month;
              Pro $20/month for unlimited agent runs.
            </li>
            <li>
              <strong>Works with:</strong> Replit projects.
            </li>
            <li>
              <strong>Trade-off:</strong> Your existing repos and editor
              config don&apos;t come with you. Great for greenfield, less
              so for daily-driver work.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            Side-by-side
          </h2>
          <div className="overflow-x-auto">
            <table className="mt-3 w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-(--muted)">
                <tr>
                  <th className="py-2 pr-4">Tool</th>
                  <th className="py-2 pr-4">Setup</th>
                  <th className="py-2 pr-4">Monthly cost</th>
                  <th className="py-2 pr-4">Drives your laptop?</th>
                  <th className="py-2 pr-4">Diff UI?</th>
                </tr>
              </thead>
              <tbody className="text-(--foreground)">
                <tr className="border-t border-white/10">
                  <td className="py-2 pr-4">ChatView</td>
                  <td className="py-2 pr-4">~60 sec</td>
                  <td className="py-2 pr-4">$9.99+/mo</td>
                  <td className="py-2 pr-4">Yes</td>
                  <td className="py-2 pr-4">Yes, streamed</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="py-2 pr-4">Codex Mobile</td>
                  <td className="py-2 pr-4">~2 min</td>
                  <td className="py-2 pr-4">Cursor Pro $20</td>
                  <td className="py-2 pr-4">No (cloud)</td>
                  <td className="py-2 pr-4">Yes</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="py-2 pr-4">GitHub Mobile + Codespaces</td>
                  <td className="py-2 pr-4">~5 min</td>
                  <td className="py-2 pr-4">$10–39</td>
                  <td className="py-2 pr-4">No (cloud)</td>
                  <td className="py-2 pr-4">PR-style</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="py-2 pr-4">Termius + Claude Code</td>
                  <td className="py-2 pr-4">30 min – 3 hrs</td>
                  <td className="py-2 pr-4">$15–30</td>
                  <td className="py-2 pr-4">No (VPS)</td>
                  <td className="py-2 pr-4">Terminal only</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="py-2 pr-4">Replit Mobile</td>
                  <td className="py-2 pr-4">~2 min</td>
                  <td className="py-2 pr-4">$0–20</td>
                  <td className="py-2 pr-4">No (cloud)</td>
                  <td className="py-2 pr-4">In-IDE</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            How to pick
          </h2>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong>You live in Cursor or VS Code already</strong> →
              ChatView. It&apos;s a remote, not a replacement.
            </li>
            <li>
              <strong>You&apos;re a Cursor power user and your laptop is
              often off</strong> → Codex Mobile.
            </li>
            <li>
              <strong>Your team is on GitHub + Copilot</strong> → GitHub
              Mobile + Codespaces.
            </li>
            <li>
              <strong>You enjoy a terminal and have time to set things up</strong>{" "}
              → Termius + Claude Code on a VPS.
            </li>
            <li>
              <strong>You&apos;re prototyping greenfield, not daily-driving
              a codebase</strong> → Replit Mobile.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            The TL;DR
          </h2>
          <p>
            If you have an IDE you trust on your laptop and you just want
            to control it from your phone, ChatView is built for you.
            It&apos;s the only option in this list that keeps your existing
            IDE, your file checkout, and your existing AI subscription as
            the source of truth — and adds a phone-shaped remote on top.
          </p>
          <p>
            Plans start at $9.99/month. Pair via QR in 60 seconds.
          </p>
          <p>
            <Link
              href="/"
              className="inline-flex rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-black"
            >
              Try ChatView →
            </Link>
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-(--foreground) hover:bg-white/[0.05]"
          >
            ← All posts
          </Link>
          <Link
            href="/blog/vibe-coding-from-your-phone-without-spinning-up-a-linode"
            className="inline-flex rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-(--foreground) hover:bg-white/[0.05]"
          >
            Read: Vibe coding without spinning up a Linode →
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
