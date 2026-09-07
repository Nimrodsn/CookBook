import { NextResponse } from "next/server";
import type { DebugLogPayload } from "@/lib/debug-log";

const MAX_ENTRIES = 200;
const DEBUG_SESSION = "c649fa";

type DebugStore = {
  entries: DebugLogPayload[];
};

function getStore(): DebugStore {
  const key = "__cookbookDebugLog";
  const globalStore = globalThis as typeof globalThis & {
    [key: string]: DebugStore | undefined;
  };
  if (!globalStore[key]) {
    globalStore[key] = { entries: [] };
  }
  return globalStore[key]!;
}

export async function POST(request: Request) {
  try {
    const entry = (await request.json()) as DebugLogPayload;
    if (entry.sessionId !== DEBUG_SESSION) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const store = getStore();
    store.entries.push(entry);
    if (store.entries.length > MAX_ENTRIES) {
      store.entries = store.entries.slice(-MAX_ENTRIES);
    }

    console.log("[debug-upload]", JSON.stringify(entry));
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

  const store = getStore();
  return NextResponse.json({
    count: store.entries.length,
    entries: store.entries,
  });
}
