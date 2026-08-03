import type { APIRoute } from 'astro';
import { getEnvVar } from '../../../lib/env';
import { AKCIE } from '../../../data/akcie-agro';

export const prerender = false;

// Finnhub symbol overrides — kde free tier nepokrývá evropskou burzu, zkusíme US ADR.
// (Free Finnhub = US akcie + forex + crypto; EU burzy .DE/.OL bývají jen v placeném tieru.)
const SYMBOL_OVERRIDE: Record<string, string> = {
  'BAYN.DE': 'BAYRY', // Bayer ADR
  'BAS.DE': 'BASFY',  // BASF ADR
  'YAR.OL': 'YARIY',  // Yara ADR
  // KWS.DE bez likvidního ADR → zůstane, pravděpodobně "—" na free tieru
};

const json = (body: unknown, status = 200, cacheS = 0) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      // Edge cache: kurzy se stahují max jednou za 30 min napříč všemi návštěvníky.
      'cache-control': cacheS > 0 ? `public, max-age=300, s-maxage=${cacheS}` : 'no-store',
    },
  });

export const GET: APIRoute = async () => {
  const key = getEnvVar('FINNHUB_API_KEY');
  if (!key) return json({ ok: false, reason: 'no_key', kurzy: {} }, 200, 0);

  const symbols = AKCIE.map((a) => ({ ticker: a.ticker, fh: SYMBOL_OVERRIDE[a.ticker] ?? a.ticker }));

  const results = await Promise.all(
    symbols.map(async ({ ticker, fh }) => {
      try {
        const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(fh)}&token=${key}`);
        if (!r.ok) return [ticker, null] as const;
        const q = (await r.json()) as { c?: number; dp?: number };
        // c = current price; 0 nebo undefined = symbol nepokryt free tierem
        if (!q || !q.c || q.c === 0) return [ticker, null] as const;
        return [ticker, { cena: q.c, zmenaPct: typeof q.dp === 'number' ? q.dp : null }] as const;
      } catch {
        return [ticker, null] as const;
      }
    })
  );

  const kurzy: Record<string, { cena: number; zmenaPct: number | null }> = {};
  for (const [ticker, data] of results) if (data) kurzy[ticker] = data;

  // Cache 30 min na edge, i když je kurzů málo.
  return json({ ok: true, kurzy, cas: null }, 200, 1800);
};
