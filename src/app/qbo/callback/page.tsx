"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * OAuth redirect bounce for quickbooks-pp-cli.
 *
 * Intuit production apps reject http://localhost redirect URIs, so this page
 * is registered as the app's redirect URI instead. It forwards the full
 * callback query string (code, state, realmId) to the CLI's local callback
 * server. The authorization code is single-use, short-lived, and useless
 * without the client secret, so a public bounce is safe.
 */
const LOCAL_CALLBACK = "http://localhost:8085/callback";
const FORWARD_DELAY_MS = 1500;

function Bounce() {
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  const target = qs ? `${LOCAL_CALLBACK}?${qs}` : LOCAL_CALLBACK;
  const realmId = searchParams.get("realmId");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.replace(target);
    }, FORWARD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [target]);

  return (
    <main
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", margin: 0 }}>
        Forwarding to local CLI…
      </h1>
      {realmId ? (
        <p style={{ margin: 0 }}>
          QuickBooks Company ID (realmId): <strong>{realmId}</strong>
        </p>
      ) : null}
      <p style={{ margin: 0, opacity: 0.7, fontSize: "0.85rem" }}>
        If nothing happens,{" "}
        <a href={target} style={{ textDecoration: "underline" }}>
          click here
        </a>{" "}
        (requires quickbooks-pp-cli auth login running locally).
      </p>
    </main>
  );
}

export default function QboCallbackBounce() {
  return (
    <Suspense fallback={null}>
      <Bounce />
    </Suspense>
  );
}
