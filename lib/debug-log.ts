export type DebugLogPayload = {
  sessionId: string;
  runId: string;
  hypothesisId: string;
  location: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: number;
};

const DEBUG_SESSION = "c649fa";
const LOCAL_INGEST =
  "http://127.0.0.1:7870/ingest/3e2796c3-9e1e-4eaa-954c-026adc63f002";

function getServerBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function debugLog(
  entry: Omit<DebugLogPayload, "sessionId" | "timestamp"> & {
    sessionId?: string;
    timestamp?: number;
  },
): void {
  const payload: DebugLogPayload = {
    sessionId: DEBUG_SESSION,
    timestamp: Date.now(),
    ...entry,
  };

  const body = JSON.stringify(payload);

  if (typeof window !== "undefined") {
    fetch("/api/debug-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }).catch(() => {});
    fetch(LOCAL_INGEST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": DEBUG_SESSION,
      },
      body,
    }).catch(() => {});
    return;
  }

  const base = getServerBaseUrl();
  fetch(`${base}/api/debug-log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).catch(() => {});
  fetch(LOCAL_INGEST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": DEBUG_SESSION,
    },
    body,
  }).catch(() => {});
}
