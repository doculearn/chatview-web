"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { performLogout } from "@/lib/logout";
import { useAuthReady } from "@/hooks/use-auth-ready";

type SiteHeaderProps = {
  activePath?: string;
};

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/download", label: "Download" },
];

export function SiteHeader({ activePath }: SiteHeaderProps) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const storedTheme = window.localStorage.getItem("chatview-theme");
    if (storedTheme === "dark" || storedTheme === "light") return storedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const isAuthenticated = useAuthReady();

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("chatview-theme", theme);
  }, [theme]);

  return (
    <header className="glass-panel float-up rounded-[1.75rem] px-4 py-3 shadow-[0_18px_50px_rgba(3,9,17,0.24)] sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/chatview-logo.png"
            alt="ChatView"
            width={40}
            height={40}
            className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
            priority
          />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">ChatView</p>
            <p className="text-sm font-semibold text-(--foreground)">Remote coding that stays in motion</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <nav className="flex flex-wrap items-center gap-2 text-sm">
          {menuItems.map((item) => {
            const isActive = item.href === activePath;
            return (
              <Link
                key={item.href}
                className={`menu-chip ${isActive ? "menu-chip-active" : ""}`}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <>
              <Link className={`menu-chip ${activePath === "/account" ? "menu-chip-active" : ""}`} href="/account">
                Account
              </Link>
              <button
                type="button"
                className="menu-chip"
                onClick={() => {
                  performLogout("/");
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className={`menu-chip ${activePath === "/login" ? "menu-chip-active" : ""}`} href="/login">
                Login
              </Link>
              <Link className={`menu-chip ${activePath === "/register" ? "menu-chip-active" : ""}`} href="/register">
                Register
              </Link>
            </>
          )}
          </nav>

          <button
            type="button"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            className="theme-toggle"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M12 5.25a.9.9 0 0 1 .9.9v1.4a.9.9 0 1 1-1.8 0v-1.4a.9.9 0 0 1 .9-.9Zm0 11.2a.9.9 0 0 1 .9.9v1.4a.9.9 0 1 1-1.8 0v-1.4a.9.9 0 0 1 .9-.9Zm6.6-5.35a.9.9 0 0 1 0 1.8h-1.4a.9.9 0 1 1 0-1.8h1.4Zm-11.2 0a.9.9 0 1 1 0 1.8H6a.9.9 0 0 1 0-1.8h1.4Zm8.17-4.6a.9.9 0 0 1 1.27 1.27l-.99.99a.9.9 0 1 1-1.27-1.27l.99-.99Zm-7.91 7.91a.9.9 0 0 1 1.27 1.27l-.99.99a.9.9 0 1 1-1.27-1.27l.99-.99Zm9.18.99a.9.9 0 1 1-1.27 1.27l-.99-.99a.9.9 0 0 1 1.27-1.27l.99.99Zm-7.91-7.91a.9.9 0 0 1-1.27 1.27l-.99-.99A.9.9 0 0 1 7.4 6.49l.99.99ZM12 8.4A3.6 3.6 0 1 1 8.4 12 3.6 3.6 0 0 1 12 8.4Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M13.9 3.5a.9.9 0 0 1 .46 1.64A7.55 7.55 0 1 0 19.7 18.6a.9.9 0 0 1 .83 1.58A9.35 9.35 0 1 1 12.58 3.08a.9.9 0 0 1 1.32.42ZM18.8 5.35l.26.7.7.26-.7.26-.26.7-.26-.7-.7-.26.7-.26.26-.7Zm1.85 4.7.17.45.45.17-.45.17-.17.45-.17-.45-.45-.17.45-.17.17-.45Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
