"use client";
import { Localized } from "@/components/localized";


import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Languages, Menu, Moon, Sun, X } from "lucide-react";
import { performLogout } from "@/lib/logout";
import { useAuthReady } from "@/hooks/use-auth-ready";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, normalizeLanguage, setAppLanguage } from "@/app/i18n";

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
  const { t, i18n } = useTranslation();
  const [languagePending, setLanguagePending] = useState(false);
  const [languageError, setLanguageError] = useState(false);
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
    <Localized><header className="glass-panel float-up px-3 py-2.5 shadow-[0_18px_50px_rgba(3,9,17,0.24)] sm:px-6 sm:py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" aria-label="ChatView" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/chatview-logo.png"
            alt="ChatView"
            width={40}
            height={40}
            className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 p-0.5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:h-11 sm:w-11 sm:rounded-2xl sm:p-1"
            priority
          />
          <div className="hidden min-w-0 sm:block">
            <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">ChatView</p>
            <p className="hidden text-sm font-semibold text-(--foreground) xl:block">Remote coding that stays in motion</p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--foreground) sm:hidden">ChatView</p>
        </Link>

        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2 max-[380px]:w-full">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md border border-(--line) bg-(--panel-soft) px-3 text-(--foreground) focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--accent) sm:flex-none">
            <Languages aria-hidden="true" className="h-5 w-5 shrink-0 text-(--accent-2)" />
            <span className="hidden text-sm sm:inline">{t("settings.language")}</span>
          <select
            aria-label={t("settings.language")}
            title={t("settings.language")}
            value={normalizeLanguage(i18n.language)}
            disabled={languagePending}
            onChange={async (event) => {
              setLanguagePending(true);
              setLanguageError(false);
              try {
                await setAppLanguage(normalizeLanguage(event.target.value));
              } catch {
                setLanguageError(true);
              } finally {
                setLanguagePending(false);
              }
            }}
            className="h-full w-28 min-w-0 flex-1 cursor-pointer bg-(--panel-soft) text-sm text-(--foreground) outline-none disabled:cursor-wait sm:w-36"
            translate="no"
          >
            {SUPPORTED_LANGUAGES.map((language) => (
              <option key={language.code} value={language.code} lang={language.code}>
                {language.label}
              </option>
            ))}
          </select>
          </label>
          <button
            type="button"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            className="theme-toggle !h-11 !w-11 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Moon aria-hidden="true" className="h-5 w-5" />
            )}
          </button>

          {/* Hamburger for mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-(--line) bg-(--panel-soft) text-(--foreground) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) lg:hidden"
            aria-label="Toggle menu"
            title="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
        {languageError && <span role="alert" className="w-full text-sm text-(--foreground)">{t("common.tryAgain")}</span>}

          {/* Desktop navigation */}
          <nav className="hidden w-full flex-wrap items-center gap-2 border-t border-(--line) pt-3 text-sm lg:flex">
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

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <nav id="mobile-navigation" className="mt-3 flex flex-wrap gap-2 border-t border-(--line) pt-3 text-sm lg:hidden">
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
    </header></Localized>
  );
}
