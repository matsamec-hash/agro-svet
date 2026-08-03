import type { APIRoute } from 'astro';
import { AKCIE } from '../../../data/akcie-agro';
import { fetchYahooQuote } from '../../../lib/yahoo-finance';

export const prerender = false;

// Živé kurzy pro karty na přehledu /akcie/. Zdroj Yahoo (free, bez klíče) —
// NATIVNÍ měna, pokrývá i evropské burzy (.DE/.OL) a KWS.DE, které Finnhub free
// tier nemá (dřív se řešilo US ADR overridy, ale ty daly cenu ve špatné měně).
// Edge cache 30 min napříč všemi návštěvníky. Statický název souboru → funguje
// BEZ trailing slash (dynamické [x].json naopak lomítko vyžaduje).
export const GET: APIRoute = async () => {
  const results = await Promise.all(
    AKCIE.map(async (a) => {
      const q = await fetchYahooQuote(a.ticker);
      if (!q) return [a.ticker, null] as const;
      return [a.ticker, { cena: q.cena, zmenaPct: q.zmenaPct }] as const;
    })
  );

  const kurzy: Record<string, { cena: number; zmenaPct: number | null }> = {};
  for (const [ticker, data] of results) if (data) kurzy[ticker] = data;

  return new Response(JSON.stringify({ ok: true, kurzy, cas: null }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=300, s-maxage=1800, stale-while-revalidate=3600',
    },
  });
};
