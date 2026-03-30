"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_CHATVIEW_API_URL ?? "https://api.chat-view.xyz/api/v1";
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("chatview-theme");
    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : preferredDark ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("chatview-theme", theme);
  }, [theme, hydrated]);

  return (
    <div className="grid-overlay flex min-h-screen flex-1 px-4 py-8 sm:px-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="glass-panel float-up rounded-2xl px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/chatview-logo.png"
                alt="ChatView"
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl border border-white/10"
                priority
              />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">ChatView</p>
                <p className="text-sm font-semibold">Web Frontend</p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2 text-sm">
              <a className="menu-chip" href="#features">Features</a>
              <a className="menu-chip" href="#connect">API</a>
              <a className="menu-chip" href="#workflow">Workflow</a>
              <button
                type="button"
                onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                className="menu-chip"
                aria-label="Toggle color theme"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </nav>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section id="features" className="glass-panel float-up rounded-3xl p-6 sm:p-10">
            <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Build Without Stopping</p>
            <h1 className="headline-glow mt-3 text-3xl font-bold leading-tight sm:text-5xl">Vibe Code From Your Phone</h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-(--muted) sm:text-lg">
              Done for the day? Not quite. Walk away from your desk and keep shipping. Send prompts from mobile, execute commands on your
              workstation, and continue coding from anywhere in the world.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="feature-card">
                <p className="font-mono text-xs text-(--accent-2)">REALTIME</p>
                <p className="mt-1 text-sm text-(--muted)">Live session updates via Web PubSub</p>
              </div>
              <div className="feature-card">
                <p className="font-mono text-xs text-(--accent-2)">REMOTE EXEC</p>
                <p className="mt-1 text-sm text-(--muted)">Run commands and edit files from your phone</p>
              </div>
              <div className="feature-card">
                <p className="font-mono text-xs text-(--accent-2)">SESSION FLOW</p>
                <p className="mt-1 text-sm text-(--muted)">Keep context synced between app and IDE</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://marketplace.visualstudio.com/items?itemName=doculearn.chatview-relay"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-(--accent) px-5 py-3 font-semibold text-black transition hover:brightness-110"
              >
                Install VS Code Extension
              </a>
              <a
                href="https://github.com/doculearn/chatview-mobile/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) px-5 py-3 font-semibold text-(--foreground) transition hover:border-(--accent)"
              >
                Download Mobile APK
              </a>
            </div>
          </section>

          <aside className="space-y-6">
            <section id="connect" className="glass-panel float-up fade-delay-1 rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Connect</p>
              <h2 className="mt-2 text-xl font-semibold">API Endpoint</h2>
              <p className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-sm text-(--accent-2)">{apiUrl}</p>
              <p className="mt-3 text-sm text-(--muted)">
                Set a custom backend at build time with <span className="font-mono">NEXT_PUBLIC_CHATVIEW_API_URL</span>.
              </p>
            </section>

            <section id="workflow" className="glass-panel float-up fade-delay-2 rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Workflow</p>
              <ol className="mt-3 space-y-3 text-sm text-(--muted)">
                <li>1. Start or resume a ChatView session in VS Code.</li>
                <li>2. Send prompts and actions from your phone.</li>
                <li>3. Watch commands execute on your workstation in real time.</li>
              </ol>
              <p className="mt-4 text-sm font-semibold text-(--success)">Never pause momentum.</p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
