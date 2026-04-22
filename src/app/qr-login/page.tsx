"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import useAuthCredentialsStore from "@/state/use-auth-credentials-store";

export default function QRLoginExchangePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing QR login...");
  const [loading, setLoading] = useState(false);
  const setCredentials = useAuthCredentialsStore((state) => state.setCredentials);

  useEffect(() => {
    const token = searchParams?.get("token");
    if (!token) {
      setStatus("Invalid QR code");
      return;
    }

    exchangeToken(token);
  }, [searchParams]);

  async function exchangeToken(qrToken: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      setLoading(true);
      setStatus("Processing QR login...");

      const response = await fetch("/api/chatview/qr-login/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken }),
        signal: controller.signal,
      });
      const data = await response.json();

      if (response.ok) {
        const accessToken =
          typeof data.access_token === "string"
            ? data.access_token
            : typeof data.access === "string"
              ? data.access
              : null;
        const refreshToken =
          typeof data.refresh_token === "string"
            ? data.refresh_token
            : typeof data.refresh === "string"
              ? data.refresh
              : null;

        if (!accessToken) {
          setStatus("Invalid exchange response from server");
          return;
        }

        setCredentials({
          accessToken,
          refreshToken: refreshToken ?? "",
        });
        setStatus("Login successful! Redirecting...");
        setTimeout(() => router.push("/account"), 2000);
      } else {
        setStatus(data.error || "Failed to login");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setStatus("Request timed out. Please try again.");
      } else {
        setStatus("Error processing login");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <PageShell activePath="/qr-login">
      <div className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10 max-w-md mx-auto">
        <h1 className="headline-glow text-xl font-bold mb-4">QR Login</h1>
        <p className="text-sm text-(--muted)">{status}</p>
        {!loading && searchParams?.get("token") && status !== "Login successful! Redirecting..." && (
          <button
            onClick={() => exchangeToken(searchParams.get("token") as string)}
            className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/80 active:bg-accent/70 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </PageShell>
  );
}