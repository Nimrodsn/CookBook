import { NextResponse } from "next/server";
import type { DebugLogPayload } from "@/lib/debug-log";
import { appendDebugEntry, getDebugStore } from "@/lib/debug-log-store";

const DEBUG_SESSION = "c649fa";

export async function POST(request: Request) {
  try {
    const entry = (await request.json()) as DebugLogPayload;
    if (entry.sessionId !== DEBUG_SESSION) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    appendDebugEntry(entry);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const session = new URL(request.url).searchParams.get("session");
  if (session !== DEBUG_SESSION) {
    return NextResponse.json({ error: "Invalid session" }, { status: 403 });
  }

  const store = getDebugStore();
  return NextResponse.json({
    count: store.entries.length,
    entries: store.entries,
  });
}
