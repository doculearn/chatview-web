"use client";

import { ReactNode, useEffect } from "react";
import { RouteShield } from "@/components/route-shield";
import { GoogleOneTap } from "@/components/google-one-tap";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

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
  return (
    <>
      <AuthBootstrap />
      <GoogleOneTap />
      <RouteShield>{children}</RouteShield>
    </>
  );
}
