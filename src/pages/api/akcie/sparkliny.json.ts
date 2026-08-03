import type { APIRoute } from 'astro';
import { AKCIE } from '../../../data/akcie-agro';
import { fetchYahooHistory } from '../../../lib/yahoo-finance';

export const prerender = false;

// Mini sparkline trendy (3 měsíce) pro všechny akcie na přehledu /akcie/.
// Zdroj Yahoo (free, bez klíče). Edge cache 1 h — 16 volání max jednou za hodinu
// napříč všemi návštěvníky. Statický název souboru → funguje BEZ trailing slash
// (viz routing asymetrie: dynamické [x].json vyžaduje lomítko, statické ne).
export const GET: APIRoute = async () => {
  const results = await Promise.all(
    AKCIE.map(async (a) => {
      const h = await fetchYahooHistory(a.ticker, '3mo');
      if (!h || h.c.length < 3) return [a.ticker, null] as const;
      // Trim na max 40 bodů (menší payload, sparkline nepotřebuje víc).
      const c = h.c.length > 40 ? h.c.slice(-40) : h.c;
      // Zaokrouhlit na 2 desetinná místa — payload ještě menší.
      return [a.ticker, c.map((v) => Math.round(v * 100) / 100)] as const;
    })
  );

  const sparkliny: Record<string, number[]> = {};
  for (const [ticker, c] of results) if (c) sparkliny[ticker] = c;

  return new Response(JSON.stringify({ ok: true, sparkliny }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
