import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getPost } from "@/lib/blog-posts";

const SLUG = "vibe-coding-from-your-phone-without-spinning-up-a-linode";
const post = getPost(SLUG)!;
const URL = `https://chat-view.xyz/blog/${SLUG}`;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  keywords: [
    "vibe coding from phone",
    "coding from your phone",
    "Claude Code mobile",
    "Cursor mobile",
    "AI coding agent mobile",
    "ssh coding from phone",
    "Linode Claude Code",
    "Termius Claude Code",
    "mobile coding workflow",
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
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Field notes</p>
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
            This week I read a Medium post by Oakley Hall called{" "}
            <em>How I&apos;m Vibe Coding From My Phone</em>. He has three kids, no
            weekend desk time, and a softball-bleacher coding problem. His
            solution: spin up a Linode instance, install Claude Code on it,
            generate SSH keys, add them to GitHub, and connect via the
            Terminus mobile SSH client. He shipped a Pong game from the
            bleachers. It worked.
          </p>
          <p>
            I loved the post. I also kept thinking the same thing the whole
            way through:{" "}
            <strong>this is a lot of DevOps for one Pong game</strong>.
          </p>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            Why developers want to code from their phones
          </h2>
          <p>
            The demand signal here matters more than the technique. Oakley
            isn&apos;t a one-off. A whole generation of developers wants to
            squeeze coding into the cracks of life — playgrounds, bleachers,
            train rides, hospital waiting rooms, the coffee queue. AI coding
            agents made this possible because the human-time portion of
            coding shrank: you prompt, the agent works, you review the diff,
            you ship.
          </p>
          <p>
            What hasn&apos;t shrunk is the cost of getting that agent onto
            your phone.
          </p>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            Three setups for coding from your phone, ranked by DevOps cost
          </h2>

          <h3 className="mt-6 text-lg font-semibold text-(--foreground)">
            Setup 1: SSH from a mobile terminal app
          </h3>
          <p>
            Spin up a cloud VM (Linode, Hetzner, DigitalOcean — $5–10/month).
            Install Node and the coding agent of your choice (Claude Code,
            Aider, Codex). Generate SSH keys. Add them to GitHub. Connect
            from your phone with Termius, Terminus, Blink, or ConnectBot.
          </p>
          <p>
            <strong>What you get:</strong> A terminal on your phone, running
            an agent on a remote box.
          </p>
          <p>
            <strong>What it costs:</strong> ~$5–10/month for the VM, a
            paid SSH client (Termius is $10/month, Blink is $20 one-time),
            an Anthropic / OpenAI API key, and somewhere between 30 minutes
            and 3 hours of setup the first time. Plus the cognitive overhead
            of managing keys and a separate Git checkout from the one on
            your laptop.
          </p>
          <p>
            <strong>What you lose:</strong> The diff-review UI your IDE
            gives you. Everything is text. Watching a multi-file refactor
            stream as ANSI escapes is a lot less ergonomic than tapping
            through diffs.
          </p>

          <h3 className="mt-6 text-lg font-semibold text-(--foreground)">
            Setup 2: Cloud IDE in a mobile browser
          </h3>
          <p>
            Open GitHub Codespaces, Replit, or Gitpod on your phone&apos;s
            browser. Some of these are usable on a 6-inch screen; most are
            not. Replit Mobile is the most polished of this category.
          </p>
          <p>
            <strong>What you get:</strong> A full IDE in a tab. Works if
            your hands are big and your patience is bigger.
          </p>
          <p>
            <strong>What it costs:</strong> Replit Hacker is $7/month;
            Codespaces is metered against your GitHub plan; Gitpod has a
            free tier with limits. You also need the agent of your choice
            wired up inside the cloud IDE.
          </p>
          <p>
            <strong>What you lose:</strong> Touch ergonomics. Cloud IDEs
            were designed for trackpads. Pinch-zoom in a terminal is not
            the experience anyone wants.
          </p>

          <h3 className="mt-6 text-lg font-semibold text-(--foreground)">
            Setup 3: A mobile remote for the IDE you already have
          </h3>
          <p>
            This is what we built ChatView to be. Install a VS Code or
            Cursor extension on your laptop. Pair your phone via QR code
            (no SSH, no signup needed to pair). Prompt the coding agent
            from your phone. Watch streamed diffs render on mobile. Approve
            or reject each edit with a tap. Your laptop runs the agent.
            Your existing Cursor / Copilot / Claude Code subscription does
            the inference.
          </p>
          <p>
            <strong>What you get:</strong> The same IDE you trust on your
            laptop, controllable from anywhere. Your file checkout, your
            extensions, your git state — there&apos;s only one copy.
          </p>
          <p>
            <strong>What it costs:</strong> Free tier with a daily prompt
            quota and one paired device. Pro for unlimited prompts and
            multi-device pairing. No cloud VM. No API key dance.
          </p>
          <p>
            <strong>What you lose:</strong> Your laptop has to be on. If
            you&apos;re going to be off-grid for a week, Setup 1 wins.
            Otherwise, Setup 3 wins on every other dimension.
          </p>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            The honest comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="mt-3 w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-(--muted)">
                <tr>
                  <th className="py-2 pr-4">Setup</th>
                  <th className="py-2 pr-4">First-time setup</th>
                  <th className="py-2 pr-4">Monthly cost</th>
                  <th className="py-2 pr-4">Diff review UX</th>
                </tr>
              </thead>
              <tbody className="text-(--foreground)">
                <tr className="border-t border-white/10">
                  <td className="py-2 pr-4">1. Linode + SSH</td>
                  <td className="py-2 pr-4">30 min – 3 hrs</td>
                  <td className="py-2 pr-4">$15–30</td>
                  <td className="py-2 pr-4">Terminal text only</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="py-2 pr-4">2. Cloud IDE in browser</td>
                  <td className="py-2 pr-4">10 min</td>
                  <td className="py-2 pr-4">$0–20</td>
                  <td className="py-2 pr-4">IDE-in-browser, touch-hostile</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="py-2 pr-4">
                    3. ChatView (mobile remote)
                  </td>
                  <td className="py-2 pr-4">~60 seconds</td>
                  <td className="py-2 pr-4">$0 free tier</td>
                  <td className="py-2 pr-4">
                    Streamed diffs, tap to approve
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            What I&apos;d tell Oakley
          </h2>
          <p>
            Your Linode setup is genuinely cool. It&apos;s also a workaround.
            The reason you spun it up wasn&apos;t because you wanted a
            second server — it was because no off-the-shelf tool existed
            that let you prompt your laptop&apos;s coding agent from your
            phone.
          </p>
          <p>
            ChatView is that tool. Pair, prompt, approve. Same Pong game in
            ten minutes instead of three hours of YAK shaving — and your
            git state stays in one place.
          </p>

          <h2 className="mt-10 text-xl font-bold text-(--foreground) sm:text-2xl">
            Try it
          </h2>
          <p>
            ChatView has a free tier with a daily prompt quota. No credit
            card to sign up. Works with Cursor, VS Code + GitHub Copilot,
            Claude Code, and Codex on the same paired session.
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <Link
                href="https://chat-view.xyz"
                className="underline underline-offset-4 hover:text-(--foreground)"
              >
                chat-view.xyz
              </Link>{" "}
              — pricing, demo
            </li>
            <li>
              <Link
                href="https://marketplace.visualstudio.com/items?itemName=doculearn.chatview-relay"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-(--foreground)"
              >
                VS Code extension
              </Link>{" "}
              — install in 10 seconds
            </li>
            <li>
              <Link
                href="/download"
                className="underline underline-offset-4 hover:text-(--foreground)"
              >
                Mobile app
              </Link>{" "}
              — Android (Play Store) + iOS (TestFlight)
            </li>
          </ul>

          <p className="text-sm text-(--muted)">
            Hat tip to Oakley Hall — his post is the best validation
            we&apos;ve seen all month. If you&apos;re reading this, Oakley,
            your free year of Pro is on us.
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
            href="/blog/top-5-vibe-coding-from-your-phone-apps-2026"
            className="inline-flex rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-black"
          >
            Next: Top 5 phone-coding apps for 2026 →
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
