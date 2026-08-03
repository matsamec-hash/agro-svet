// Yahoo Finance chart API — free, bez klíče, funguje server-side (s User-Agent).
// Používá se jen pro HISTORII zavíracích cen (graf na detailu akcie). Živý kurz
// a fundamenty tahá agro-svet z Finnhubu. Vše graceful → null při chybě/rate-limitu.

export interface StockHistory {
  t: number[]; // UNIX sekundy
  c: number[]; // zavírací cena
}

/** Historie zavíracích cen pro graf (range=1y, denní). null při chybě. */
export async function fetchYahooHistory(ticker: string): Promise<StockHistory | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1y&interval=1d`;
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
