"use client";

import { ReactNode, useEffect } from "react";
import { RouteShield } from "@/components/route-shield";
import { GoogleOneTap } from "@/components/google-one-tap";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";
import { I18nextProvider } from "react-i18next";
import i18n, { detectBrowserLanguage, setAppLanguage } from "@/app/i18n";

type ProvidersProps = {
  children: ReactNode;
};

function AuthBootstrap() {
  const loadFromCookies = useAuthCredentialsStore((state) => state.loadFromCookies);

  useEffect(() => {
    loadFromCookies();
  }, [loadFromCookies]);

  return null;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    void setAppLanguage(detectBrowserLanguage()).catch(() => {});
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <AuthBootstrap />
      <GoogleOneTap />
      <RouteShield>{children}</RouteShield>
    </I18nextProvider>
  );
}
