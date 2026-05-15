"use client";

import { useState } from "react";

const SHARE_URL = "https://chat-view.xyz/coffee";
const SHARE_TEXT =
  "ChatView is Codex Mobile, but for VS Code, Claude Code, Codex & Cursor — built by one indie hacker. If it's saved you time, buy me a coffee ☔";

export function CoffeeShareButtons() {
  const [copied, setCopied] = useState(false);

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    SHARE_TEXT,
  )}&url=${encodeURIComponent(SHARE_URL)}`;

  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    SHARE_URL,
  )}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-(--line) bg-(--panel-soft) px-5 py-3 text-sm font-semibold text-(--foreground) transition hover:border-(--accent)"
      >
        <span aria-hidden>𝕏</span> Share on X
      </a>
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-(--line) bg-(--panel-soft) px-5 py-3 text-sm font-semibold text-(--foreground) transition hover:border-(--accent)"
      >
        <span aria-hidden>in</span> Share on LinkedIn
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-xl border border-(--line) bg-(--panel-soft) px-5 py-3 text-sm font-semibold text-(--foreground) transition hover:border-(--accent)"
      >
        {copied ? "✓ Link copied" : "🔗 Copy link"}
      </button>
    </div>
  );
}
