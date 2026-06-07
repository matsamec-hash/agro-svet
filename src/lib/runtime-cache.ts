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

const store = new Map<string, Entry>();

function parseTtlSeconds(cacheControl: string | null): number {
  if (!cacheControl) return 0;
  const s = /s-maxage=(\d+)/.exec(cacheControl);
  if (s) return parseInt(s[1], 10);
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
    store.set(request.url, {
      body,
      status: response.status,
      headers: [...response.headers],
      expiresAt: Date.now() + ttl * 1000,
    });
  },
};
