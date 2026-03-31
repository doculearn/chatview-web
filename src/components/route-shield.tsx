"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NextShield } from "next-shield";
import { useAuthReady } from "@/hooks/use-auth-ready";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

const privateRoutes = ["/account"] as const;
const publicRoutes = ["/login", "/register"] as const;
const hybridRoutes = ["/", "/docs", "/pricing", "/download"];

type RouteShieldProps = {
  children: ReactNode;
};

export function RouteShield({ children }: RouteShieldProps) {
  const pathname = usePathname() ?? "/";
  const { replace } = useRouter();
  const isAuth = useAuthReady();
  const hasHydrated = useAuthCredentialsStore((state) => state.hasHydrated);

  const isLoading = !hasHydrated;

  return (
    <NextShield
      isAuth={isAuth}
      isLoading={isLoading}
      router={{ pathname, replace } as unknown as { pathname: string; replace: (url: string) => void }}
      loginRoute="/login"
      accessRoute="/account"
      privateRoutes={[...privateRoutes]}
      publicRoutes={[...publicRoutes]}
      hybridRoutes={hybridRoutes}
      LoadingComponent={
        <div className="grid-overlay flex min-h-screen items-center justify-center">
          <p className="menu-chip">Loading...</p>
        </div>
      }
    >
      {children}
    </NextShield>
  );
}
