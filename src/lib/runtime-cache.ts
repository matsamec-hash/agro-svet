// Minimal Web Cache API-compatible cache for the Node origin.
//
// On Cloudflare the code used `caches.default` (per-PoP edge cache). On the
// VPS Node origin that global doesn't exist, so this provides an in-memory
// TTL store with the same `.match()` / `.put()` shape. The Coolify app runs
// a single instance, so one process-local store is consistent for all
// requests. Entries expire per their Cache-Control TTL (s-maxage preferred,
// else max-age); responses that don't opt in are not cached.

interface Entry {
  body: string;
  status: number;
  headers: [string, string][];
  expiresAt: number; // epoch ms
}

// Caps the number of live entries to prevent unbounded memory growth when keys
// are attacker-controlled (e.g. edge-throttle uses per-IP/email cache keys).
const MAX_ENTRIES = 5000;

const store = new Map<string, Entry>();

// NOTE: stale-while-revalidate / stale-if-error are NOT honored — only s-maxage
// (preferred) or max-age set a hard TTL. SWR was an edge-cache feature; on the
// Node origin an entry simply expires at its TTL and the next request is a miss.
function parseTtlSeconds(cacheControl: string | null): number {
  if (!cacheControl) return 0;
  const s = /s-maxage=(\d+)/.exec(cacheControl);
  if (s) return parseInt(s[1], 10);
  // The literal substring "max-age=" never appears inside "s-maxage=…" (it's
  // "s-maxage", not "s-max-age"), so this regex cannot match an s-maxage value;
  // and even if it did, the s-maxage branch above already returned first.
  const m = /max-age=(\d+)/.exec(cacheControl);
  return m ? parseInt(m[1], 10) : 0;
}

export interface RuntimeCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}

export const runtimeCache: RuntimeCache = {
  async match(request) {
    const entry = store.get(request.url);
    if (!entry) return undefined;
    if (Date.now() >= entry.expiresAt) {
      store.delete(request.url);
      return undefined;
    }
    return new Response(entry.body, { status: entry.status, headers: entry.headers });
  },

  async put(request, response) {
    const ttl = parseTtlSeconds(response.headers.get('cache-control'));
    if (ttl <= 0) return; // only cache responses that explicitly opt in
    const body = await response.clone().text();

    // Enforce the bounded store before inserting the new entry.
    if (store.size >= MAX_ENTRIES) {
      // Pass 1: sweep all expired entries — free memory without evicting live data.
      const now = Date.now();
      for (const [key, entry] of store) {
        if (entry.expiresAt <= now) {
          store.delete(key);
        }
      }
      // Pass 2: if the store is still at capacity, evict oldest entries by
      // insertion order (Map guarantees insertion order, so the first key()
      // iterator value is always the oldest entry).
      while (store.size >= MAX_ENTRIES) {
        const oldest = store.keys().next().value as string;
        store.delete(oldest);
      }
    }

    store.set(request.url, {
      body,
      status: response.status,
      headers: [...response.headers],
      expiresAt: Date.now() + ttl * 1000,
    });
  },
};

/** For tests only — resets the module-level store between test cases. */
export function __clearCacheForTesting(): void {
  store.clear();
}
