"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { authFetch } from "@/lib/auth-fetch";
import QRCode from "react-qr-code";

export default function QRLoginPage() {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [mobileLoginUri, setMobileLoginUri] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    generateQR();
  }, []);

  async function generateQR() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      setLoading(true);
      setError(null);

      const response = await authFetch("/api/chatview/qr-login/generate", {
        method: "POST",
        signal: controller.signal,
      });
      const data = await response.json();
      if (response.ok) {
        setQrToken(data.qrToken || data.qr_token || null);
        setMobileLoginUri(typeof data.mobile_login_uri === "string" ? data.mobile_login_uri : null);
      } else {
        setError(data.error || "Failed to generate QR code");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Error generating QR code");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  const qrValue =
    mobileLoginUri || (qrToken && origin ? `${origin}/qr-login?token=${encodeURIComponent(qrToken)}` : "");

  return (
    <PageShell activePath="/qr">
      <div className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10 max-w-md mx-auto">
        <h1 className="headline-glow text-xl font-bold mb-4">QR Code Login</h1>
        <p className="text-sm text-(--muted) mb-6">
          Scan this QR code with your mobile app to log in automatically.
        </p>

        {loading && <p>Loading QR code...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {error && (
          <button
            onClick={generateQR}
            className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/80 active:bg-accent/70 transition-colors"
          >
            Retry
          </button>
        )}
        {qrValue && (
          <div className="flex justify-center">
            <QRCode value={qrValue} size={256} />
          </div>
        )}

        <p className="text-xs text-(--muted) mt-4">
          This code expires in 5 minutes. Refresh the page to generate a new one.
        </p>
      </div>
    </PageShell>
  );
}