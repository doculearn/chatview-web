"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

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
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("chatview-theme", theme);
  }, [theme]);

  return (
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
          <button
            type="button"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            className="menu-chip"
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          {isAuthenticated ? (
            <>
              <Link className={`menu-chip ${activePath === "/account" ? "menu-chip-active" : ""}`} href="/account">
                Account
              </Link>
              <button
                type="button"
                className="menu-chip"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
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
      </div>
    </header>
  );
}
