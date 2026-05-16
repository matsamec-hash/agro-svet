import type { APIRoute } from 'astro';
import statsData from '../../data/agro-stats.json';
import { AGRO_EVENTS } from '../../data/agro-events';

export const prerender = true;

// Heavy commodity time-series + 5y avgs split out of the /statistiky/ HTML
// shell. ~86 KB inline JSON moves to a 24h-immutable JSON asset that loads
// async after the page paints. Cuts /statistiky/index.html from ~230 KB to
// ~80 KB while preserving the on-page chart for SEO (Chart.js renders
// after fetch resolves).

export const GET: APIRoute = () => {
  const { commodityFull, fiveYearAvgs } = statsData as any;
  const namedSeries = (commodityFull as Array<{ name: string; unit: string; data: Array<{ label: string; value: number }> }>).map(
    (s) => ({
      name: s.name,
      unit: s.unit,
      // Compact: drop sortKey if present, keep only label+value (chart only needs these).
      data: s.data.map((d) => ({ label: d.label, value: d.value })),
    }),
  );
  const payload = {
    series: namedSeries,
    events: AGRO_EVENTS,
    fiveYearAvg: fiveYearAvgs,
    default0: namedSeries[0]?.name ?? 'Pšenice',
  };
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // 24h CF cache + 7d SWR — commodity series refreshes monthly via
      // `npm run stats:refresh`. Deploy cf-purge invalidates immediately.
      'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};
