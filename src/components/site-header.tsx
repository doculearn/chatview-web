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
  { href: "/blog", label: "Blog" },
];

export function SiteHeader({ activePath }: SiteHeaderProps) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const storedTheme = window.localStorage.getItem("chatview-theme");
    if (storedTheme === "dark" || storedTheme === "light") return storedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const isAuthenticated = useAuthReady();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("chatview-theme", theme);
  }, [theme]);

  return (
    <header className="glass-panel float-up rounded-2xl px-3 py-2.5 shadow-[0_18px_50px_rgba(3,9,17,0.24)] sm:rounded-[1.75rem] sm:px-6 sm:py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/chatview-logo.png"
            alt="ChatView"
            width={40}
            height={40}
            className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 p-0.5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:h-11 sm:w-11 sm:rounded-2xl sm:p-1"
            priority
          />
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">ChatView</p>
            <p className="text-sm font-semibold text-(--foreground)">Remote coding that stays in motion</p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--foreground) sm:hidden">ChatView</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            className="theme-toggle !h-8 !w-8 sm:!h-[2.85rem] sm:!w-[2.85rem]"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5">
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
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5">
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

          {/* Hamburger for mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) text-(--foreground) lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-2 text-sm lg:flex">
            {menuItems.map((item) => {
              const isActive = item.href === activePath;
              return (
                <Link key={item.href} className={`menu-chip ${isActive ? "menu-chip-active" : ""}`} href={item.href}>
                  {item.label}
                </Link>
              );
            })}
            {isAuthenticated ? (
              <>
                <Link className={`menu-chip ${activePath === "/account" ? "menu-chip-active" : ""}`} href="/account">Account</Link>
                <button type="button" className="menu-chip" onClick={() => performLogout("/")}>Sign out</button>
              </>
            ) : (
              <>
                <Link className={`menu-chip ${activePath === "/login" ? "menu-chip-active" : ""}`} href="/login">Login</Link>
                <Link className={`menu-chip ${activePath === "/register" ? "menu-chip-active" : ""}`} href="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <nav className="mt-3 flex flex-wrap gap-2 border-t border-(--line) pt-3 text-sm lg:hidden">
          {menuItems.map((item) => {
            const isActive = item.href === activePath;
            return (
              <Link key={item.href} className={`menu-chip ${isActive ? "menu-chip-active" : ""}`} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <>
              <Link className={`menu-chip ${activePath === "/account" ? "menu-chip-active" : ""}`} href="/account" onClick={() => setMenuOpen(false)}>Account</Link>
              <button type="button" className="menu-chip" onClick={() => { setMenuOpen(false); performLogout("/"); }}>Sign out</button>
            </>
          ) : (
            <>
              <Link className={`menu-chip ${activePath === "/login" ? "menu-chip-active" : ""}`} href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link className={`menu-chip ${activePath === "/register" ? "menu-chip-active" : ""}`} href="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
