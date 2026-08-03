import type { APIRoute } from 'astro';
import { getEnvVar } from '../../../lib/env';
import { AKCIE } from '../../../data/akcie-agro';
import { fetchYahooHistory, fetchYahooQuote } from '../../../lib/yahoo-finance';

export const prerender = false;

const SYMBOL_OVERRIDE: Record<string, string> = {
  'BAYN.DE': 'BAYRY',
  'BAS.DE': 'BASFY',
  'YAR.OL': 'YARIY',
};

const json = (body: unknown, status = 200, cacheS = 0) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': cacheS > 0 ? `public, max-age=300, s-maxage=${cacheS}` : 'no-store',
    },
  });

async function fh(path: string, key: string): Promise<any | null> {
  try {
    const r = await fetch(`https://finnhub.io/api/v1/${path}&token=${key}`);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ params }) => {
  const ticker = params.ticker;
  if (!ticker || !AKCIE.some((a) => a.ticker === ticker)) return json({ ok: false, reason: 'unknown' }, 404);

  const key = getEnvVar('FINNHUB_API_KEY');

  // Kurz + 52t rozpětí + graf: Yahoo (free, bez klíče, NATIVNÍ měna, pokrývá i
  // evropské .DE/.OL a KWS.DE, které Finnhub free nemá). Původní ticker, NE
  // Finnhub ADR override. Fundamenty (tržní kap./P-E/dividenda/odvětví): Finnhub.
  const fhSym = SYMBOL_OVERRIDE[ticker] ?? ticker;
  const enc = encodeURIComponent(fhSym);

  const [yq, profile, metrics, historie] = await Promise.all([
    fetchYahooQuote(ticker),
    key ? fh(`stock/profile2?symbol=${enc}`, key) : Promise.resolve(null),
    key ? fh(`stock/metric?symbol=${enc}&metric=all`, key) : Promise.resolve(null),
    fetchYahooHistory(ticker),
  ]);

  const m = metrics?.metric ?? {};
  const out = {
    ok: true,
    kurz: yq ? { cena: yq.cena, zmenaPct: yq.zmenaPct } : null,
    profil: profile
      ? {
          marketCap: profile.marketCapitalization ?? null, // v mil. USD
          mena: profile.currency ?? null,
          burza: profile.exchange ?? null,
          ipo: profile.ipo ?? null,
          odvetvi: profile.finnhubIndustry ?? null,
          logo: profile.logo ?? null,
        }
      : null,
    metriky: {
      pe: m.peTTM ?? m.peBasicExclExtraTTM ?? null,
      // 52t rozpětí z Yahoo (nativní měna, konzistentní s kurzem; fallback Finnhub).
      high52: yq?.high52 ?? m['52WeekHigh'] ?? null,
      low52: yq?.low52 ?? m['52WeekLow'] ?? null,
      dividendYield: m.dividendYieldIndicatedAnnual ?? m.currentDividendYieldTTM ?? null,
      revenue: m.revenuePerShareTTM ?? null,
    },
    historie, // { t:number[], c:number[] } | null — pro graf (Yahoo, 1r denní)
  };

  return json(out, 200, 1800);
};
