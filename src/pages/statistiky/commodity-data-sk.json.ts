import type { APIRoute } from 'astro';
import statsData from '../../data/agro-stats-sk.json';

export const prerender = true;

// Full SK commodity annual time-series. SK data is annual (year labels, ~25
// points per commodity), no 5-year monthly averages, no AGRO_EVENTS.

export const GET: APIRoute = () => {
  const { commodityFull } = statsData as any;
  const series = (commodityFull as Array<{ name: string; unit: string; data: Array<{ label: string; value: number }> }>).map(
    (s) => ({ name: s.name, unit: s.unit, data: s.data.map((d) => ({ label: d.label, value: d.value })) }),
  );
  const payload = { series, events: [], fiveYearAvg: {}, default0: series[0]?.name ?? 'Pšenica' };
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};
