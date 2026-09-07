import type { DebugLogPayload } from "@/lib/debug-log";

const MAX_ENTRIES = 200;
const STORE_KEY = "__cookbookDebugLog";

type DebugStore = {
  entries: DebugLogPayload[];
};

export function getDebugStore(): DebugStore {
  const globalStore = globalThis as typeof globalThis & {
    [STORE_KEY]: DebugStore | undefined;
  };
  if (!globalStore[STORE_KEY]) {
    globalStore[STORE_KEY] = { entries: [] };
  }
  return globalStore[STORE_KEY]!;
}

export function appendDebugEntry(entry: DebugLogPayload): void {
  const store = getDebugStore();
  store.entries.push(entry);
  if (store.entries.length > MAX_ENTRIES) {
    store.entries = store.entries.slice(-MAX_ENTRIES);
  }
  console.log("[debug-upload]", JSON.stringify(entry));
}
