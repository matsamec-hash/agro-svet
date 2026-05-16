// Per-key throttle implemented on top of Cloudflare's edge Cache API.
// Designed for cheap, best-effort spike protection on POST endpoints
// (newsletter signup, contact forms, bazar lead capture).
//
// Limitations:
// - Cache state is per-PoP, so a determined attacker hopping between
//   regions can exceed the local cap. Acceptable when the cap is generous
//   enough that honest users never hit it, and the goal is to keep the
//   downstream Resend/Supabase from melting under a viral spike.
// - Reads are eventually consistent; tight bursts at the same PoP may
//   over-count by 1–2.

export interface ThrottleOptions {
  /** Logical bucket name, used as part of the cache key. */
  bucket: string;
  /** Caller key — typically IP or email. */
  key: string;
  /** Max events allowed inside the window. */
  max: number;
  /** Window length in seconds. */
  windowS: number;
  /** Cloudflare `locals.cfContext` for waitUntil(). */
  ctx?: { waitUntil?: (p: Promise<unknown>) => void };
}

export interface ThrottleResult {
  /** True if the request is allowed. */
  ok: boolean;
  /** Remaining events in this window (clamped to >= 0). */
  remaining: number;
  /** Retry hint in seconds if `ok === false`. */
  retryAfterS: number;
}

export async function edgeThrottle(opts: ThrottleOptions): Promise<ThrottleResult> {
  const { bucket, key, max, windowS, ctx } = opts;
  if (!key || key === 'unknown') {
    return { ok: true, remaining: max, retryAfterS: 0 };
  }
  const cache = (globalThis as any).caches?.default;
  if (!cache) return { ok: true, remaining: max, retryAfterS: 0 };

  const cacheKey = new Request(`https://throttle.internal/${encodeURIComponent(bucket)}/${encodeURIComponent(key)}`);
  let count = 0;
  try {
    const hit = await cache.match(cacheKey);
    if (hit) {
      const parsed = parseInt(await hit.text(), 10);
      if (!Number.isNaN(parsed)) count = parsed;
    }
  } catch { /* swallow */ }

  if (count >= max) {
    return { ok: false, remaining: 0, retryAfterS: windowS };
  }

  const next = count + 1;
  try {
    const res = new Response(String(next), {
      headers: {
        'cache-control': `public, max-age=${windowS}, s-maxage=${windowS}`,
        'content-type': 'text/plain',
      },
    });
    const put = cache.put(cacheKey, res);
    if (ctx?.waitUntil) ctx.waitUntil(put);
    else await put;
  } catch { /* swallow */ }

  return { ok: true, remaining: Math.max(0, max - next), retryAfterS: 0 };
}
