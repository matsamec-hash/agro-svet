/**
 * In-memory sliding-window rate limit pro veřejný MCP endpoint (`/api/mcp/`).
 *
 * Endpoint je read-only a bez auth (veřejná data), ale bez limitu by šlo
 * levně scrapovat / zahltit bazar dotazy. Limit je per-IP, per-proces —
 * agro-svět běží jako jeden @astrojs/node kontejner na Coolify, takže sdílená
 * Mapa v paměti stačí (na deploy se resetuje, což je pro anti-abuse OK).
 *
 * Žádná DB tabulka ani migrace — narozdíl od [[bazar-code-ratelimit]], který
 * potřebuje perzistenci přes instance.
 */

export const MCP_WINDOW_MS = 60_000; // 1 minuta
export const MCP_MAX_REQUESTS = 60; // požadavků na IP za okno

const hits = new Map<string, number[]>();

export interface RateLimitResult {
  limited: boolean;
  /** Sekundy do uvolnění (pro Retry-After), 0 když není limitováno. */
  retryAfter: number;
}

/**
 * Zaznamená požadavek z `ip` a vrátí, zda překročil limit. Volání s limited=true
 * požadavek NEzapočítá (okno se neposouvá trestem za odmítnuté pokusy).
 */
export function checkMcpRateLimit(ip: string, now: number = Date.now()): RateLimitResult {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < MCP_WINDOW_MS);

  if (recent.length >= MCP_MAX_REQUESTS) {
    hits.set(ip, recent);
    const retryAfter = Math.max(1, Math.ceil((MCP_WINDOW_MS - (now - recent[0])) / 1000));
    return { limited: true, retryAfter };
  }

  recent.push(now);
  hits.set(ip, recent);

  // Ohraničení paměti: občas vymeť prázdné/staré klíče.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= MCP_WINDOW_MS)) hits.delete(k);
    }
  }

  return { limited: false, retryAfter: 0 };
}

/** Vytáhne klientskou IP z hlaviček (za Cloudflare je reálná v cf-connecting-ip). */
export function clientIpFrom(request: Request, fallback?: string): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    fallback ||
    'unknown'
  );
}
