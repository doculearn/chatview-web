"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { RouteShield } from "@/components/route-shield";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <RouteShield>{children}</RouteShield>
    </SessionProvider>
  );
}
