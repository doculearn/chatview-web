"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./lang/en.json";
import es from "./lang/es.json";
import ptBR from "./lang/pt-BR.json";
import de from "./lang/de.json";
import fr from "./lang/fr.json";
import nl from "./lang/nl.json";
import ja from "./lang/ja.json";
import ko from "./lang/ko.json";
import zhHans from "./lang/zh-Hans.json";
import zhHK from "./lang/zh-HK.json";
import hi from "./lang/hi.json";
import ar from "./lang/ar.json";
import he from "./lang/he.json";
import af from "./lang/af.json";
import zu from "./lang/zu.json";
import xh from "./lang/xh.json";
import st from "./lang/st.json";
import tn from "./lang/tn.json";

/** Kept in sync with chatview-mobile's src/i18n/index.ts. */
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt-BR", label: "Português (Brasil)", flag: "🇧🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "zh-Hans", label: "普通话 (简体)", flag: "🇨🇳" },
  { code: "zh-HK", label: "廣東話 (繁體)", flag: "🇭🇰" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "af", label: "Afrikaans", flag: "🇿🇦" },
  { code: "zu", label: "isiZulu", flag: "🇿🇦" },
  { code: "xh", label: "isiXhosa", flag: "🇿🇦" },
  { code: "st", label: "Sesotho", flag: "🇱🇸" },
  { code: "tn", label: "Setswana", flag: "🇧🇼" },
] as const;

export const RTL_LANGUAGES: readonly string[] = ["ar", "he"];
export const LANGUAGE_STORAGE_KEY = "i18nextLng";

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

const resources = {
  en: { translation: en },
  es: { translation: es },
  "pt-BR": { translation: ptBR },
  de: { translation: de },
  fr: { translation: fr },
  nl: { translation: nl },
  ja: { translation: ja },
  ko: { translation: ko },
  "zh-Hans": { translation: zhHans },
  "zh-HK": { translation: zhHK },
  hi: { translation: hi },
  ar: { translation: ar },
  he: { translation: he },
  af: { translation: af },
  zu: { translation: zu },
  xh: { translation: xh },
  st: { translation: st },
  tn: { translation: tn },
};

/** Maps a browser tag (e.g. "pt-PT", "zh-TW", "iw") onto a shipped catalog. */
export function normalizeLanguage(tag: string | null | undefined): LanguageCode {
  const lower = (tag || "").trim().toLowerCase();
  if (!lower) return "en";

  if (lower.startsWith("pt")) return "pt-BR";
  if (lower.startsWith("es")) return "es";
  if (
    lower.startsWith("yue") ||
    lower.includes("hant") ||
    lower.startsWith("zh-hk") ||
    lower.startsWith("zh-mo") ||
    lower.startsWith("zh-tw")
  ) {
    return "zh-HK";
  }
  if (lower.startsWith("zh") || lower.startsWith("cmn")) return "zh-Hans";
  if (lower.startsWith("iw")) return "he";

  const exact = SUPPORTED_LANGUAGES.find((l) => l.code.toLowerCase() === lower);
  if (exact) return exact.code;

  const base = lower.split("-")[0];
  const baseMatch = SUPPORTED_LANGUAGES.find(
    (l) => l.code.split("-")[0].toLowerCase() === base,
  );
  return baseMatch ? baseMatch.code : "en";
}

/**
 * Always starts on English so the server render and the first client render
 * match; `I18nProvider` switches to the stored/browser language after mount.
 */
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    react: { useSuspense: false },
    interpolation: { escapeValue: false },
  });
}

export function detectBrowserLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored) return normalizeLanguage(stored);
  return normalizeLanguage(window.navigator.language);
}

export function applyDocumentLanguage(code: string): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = code;
  document.documentElement.dir = RTL_LANGUAGES.includes(code) ? "rtl" : "ltr";
}

export async function setAppLanguage(code: LanguageCode): Promise<void> {
  await i18n.changeLanguage(code);
  applyDocumentLanguage(code);
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  } catch {
    // Language still applies for this session.
  }
}

export default i18n;
