"use client";

import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/app/i18n";
import webEnglish from "@/app/lang/web/en.json";

const templates = Object.keys(webEnglish).filter((key) => key.includes("{{value"))
  .map((key) => {
    const variables = key.match(/{{value\d+}}/g) || [];
    const pattern = key.split(/{{value\d+}}/g)
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("([\\s\\S]+?)");
    return { key, variables, pattern: new RegExp(`^${pattern}$`) };
  });

type ContentProps = {
  children?: ReactNode;
  translate?: string;
  placeholder?: string;
  title?: string;
  alt?: string;
  "aria-label"?: string;
};

export function translateText(text: string, language: string): string {
  const content = text.trim();
  if (!content) return text;
  let key = content;
  const values: Record<string, string> = {};
  if (!Object.hasOwn(webEnglish, content)) {
    for (const template of templates) {
      const match = content.match(template.pattern);
      if (!match) continue;
      key = template.key;
      template.variables.forEach((variable, index) => {
        values[variable.slice(2, -2)] = match[index + 1];
      });
      break;
    }
  }
  const translated = i18n.t(key, {
    ...values,
    lng: language,
    ns: "web",
    keySeparator: false,
    nsSeparator: false,
    defaultValue: content,
    interpolation: { skipOnVariables: true },
  });
  return text.replace(content, translated);
}

export function localizeContent(children: ReactNode, language: string): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") return translateText(child, language);
    if (!isValidElement<ContentProps>(child)) return child;
    if (
      child.props.translate === "no" ||
      (typeof child.type === "string" &&
        ["code", "pre", "script", "style", "textarea", "svg"].includes(child.type))
    ) return child;

    const props: ContentProps = {};
    if (typeof child.type === "string") {
      for (const attribute of ["placeholder", "title", "alt", "aria-label"] as const) {
        const value = child.props[attribute];
        if (value) props[attribute] = translateText(value, language);
      }
    }
    if (child.props.children !== undefined) {
      props.children = localizeContent(child.props.children, language);
    }
    return cloneElement(child, props);
  });
}

export function Localized({ children }: { children: ReactNode }) {
  const { i18n: instance } = useTranslation("web", { i18n });
  return localizeContent(children, instance.language);
}