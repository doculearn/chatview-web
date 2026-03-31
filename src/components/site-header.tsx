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
                  d="M12 3.75v2.1m0 12.3v2.1m8.25-8.25h-2.1M5.85 12H3.75m14.084 5.834-1.485-1.485M7.651 7.651 6.166 6.166m11.668 0-1.485 1.485M7.651 16.349l-1.485 1.485M15.75 12A3.75 3.75 0 1 1 8.25 12a3.75 3.75 0 0 1 7.5 0Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M21 12.79A9 9 0 0 1 11.21 3c-.14 0-.28 0-.42.01a.75.75 0 0 0-.55 1.2A7.5 7.5 0 1 1 19.8 13.76a.75.75 0 0 0 1.2-.55Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
