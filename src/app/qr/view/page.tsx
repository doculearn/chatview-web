"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

function QRViewInner() {
  const params = useSearchParams();
  const data = params.get("data") ?? "";
  const exp = params.get("exp");

  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (!exp) return;
    const expiresAt = new Date(exp).getTime();
    if (Number.isNaN(expiresAt)) return;

    const tick = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setRemaining("Expired");
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${m}:${s.toString().padStart(2, "0")} remaining`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [exp]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#0b0b10",
        color: "#f5f5f7",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: 32,
        }}
      >
        <h1 style={{ fontSize: "1.25rem", margin: "0 0 8px" }}>
          Scan with ChatView mobile
        </h1>
        <p style={{ opacity: 0.75, margin: "6px 0 20px", fontSize: "0.9rem" }}>
          Open the ChatView app on your phone and tap the scanner to sign in.
        </p>

        {data ? (
          <div
            style={{
              display: "inline-block",
              padding: 16,
              background: "#fff",
              borderRadius: 12,
            }}
          >
            <QRCode value={data} size={256} />
          </div>
        ) : (
          <p style={{ color: "#ff6b6b" }}>
            No QR data supplied. Return to VS Code and try again.
          </p>
        )}

        {remaining && (
          <p
            style={{
              marginTop: 16,
              fontSize: "0.85rem",
              opacity: 0.7,
            }}
          >
            {remaining}
          </p>
        )}

        <p style={{ marginTop: 24, fontSize: "0.75rem", opacity: 0.5 }}>
          You can close this tab once your mobile app confirms the login.
        </p>
      </div>
    </main>
  );
}

export default function QRViewPage() {
  return (
    <Suspense fallback={null}>
      <QRViewInner />
    </Suspense>
  );
}
