// Yahoo Finance chart API — free, bez klíče, funguje server-side (s User-Agent).
// Používá se jen pro HISTORII zavíracích cen (graf na detailu akcie). Živý kurz
// a fundamenty tahá agro-svet z Finnhubu. Vše graceful → null při chybě/rate-limitu.

export interface StockHistory {
  t: number[]; // UNIX sekundy
  c: number[]; // zavírací cena
}

export interface StockQuote {
  cena: number;
  zmenaPct: number | null;
  mena: string;
  high52: number | null;
  low52: number | null;
}

/** Živý kurz + denní změna v NATIVNÍ měně (range=1d → chartPreviousClose =
 *  včerejší close). Pokrývá i evropské burzy (.DE/.OL) a KWS.DE, které Finnhub
 *  free tier nemá. null při chybě/rate-limitu. */
export async function fetchYahooQuote(ticker: string): Promise<StockQuote | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1d&interval=1d`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; agro-svet/1.0)' } });
    if (!r.ok) return null;
    const j: any = await r.json();
    const m = j?.chart?.result?.[0]?.meta;
    const cena = typeof m?.regularMarketPrice === 'number' ? m.regularMarketPrice : null;
    if (cena == null) return null;
    const prev = typeof m.chartPreviousClose === 'number' ? m.chartPreviousClose
      : (typeof m.previousClose === 'number' ? m.previousClose : cena);
    return {
      cena,
      zmenaPct: prev ? ((cena - prev) / prev) * 100 : null,
      mena: m.currency ?? 'USD',
      high52: typeof m.fiftyTwoWeekHigh === 'number' ? m.fiftyTwoWeekHigh : null,
      low52: typeof m.fiftyTwoWeekLow === 'number' ? m.fiftyTwoWeekLow : null,
    };
  } catch {
    return null;
  }
}

/** Historie zavíracích cen pro graf (denní). range např. '1y' | '3mo'. null při chybě. */
export async function fetchYahooHistory(ticker: string, range = '1y'): Promise<StockHistory | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=${range}&interval=1d`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; agro-svet/1.0)' } });
    if (!r.ok) return null;
    const j: any = await r.json();
    const res = j?.chart?.result?.[0] ?? null;
    const ts: number[] = res?.timestamp ?? [];
    const closes: (number | null)[] = res?.indicators?.quote?.[0]?.close ?? [];
    const t: number[] = [];
    const c: number[] = [];
    for (let i = 0; i < ts.length; i++) {
      if (typeof closes[i] === 'number') {
        t.push(ts[i]);
        c.push(closes[i] as number);
      }
    }
    return t.length > 1 ? { t, c } : null;
  } catch {
    return null;
  }
}
