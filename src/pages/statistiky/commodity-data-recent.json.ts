import type { APIRoute } from 'astro';
import statsData from '../../data/agro-stats.json';
import { AGRO_EVENTS } from '../../data/agro-events';

export const prerender = true;

// Recent slice of the commodity time-series — last 60 months per commodity
// (matches the default "5 let" window in CommodityChart). About 1/3 the size
// of the full payload. The chart loads this eagerly; the full file is only
// fetched when a visitor explicitly clicks "Vše".

const RECENT_MONTHS = 60;

export const GET: APIRoute = () => {
  const { commodityFull, fiveYearAvgs } = statsData as any;
  const namedSeries = (commodityFull as Array<{ name: string; unit: string; data: Array<{ label: string; value: number }> }>).map(
    (s) => ({
      name: s.name,
      unit: s.unit,
      data: s.data.slice(-RECENT_MONTHS).map((d) => ({ label: d.label, value: d.value })),
    }),
  );

  // 5y avgs are calendar-aligned — only keep the ones that overlap the recent
  // window. Same compaction as series data.
  const recentLabels = new Set<string>();
  for (const s of namedSeries) for (const p of s.data) recentLabels.add(p.label);
  const fiveYearAvg: Record<string, Array<{ label: string; avg: number }>> = {};
  for (const [name, points] of Object.entries(fiveYearAvgs as Record<string, Array<{ label: string; avg: number }> | null>)) {
    if (!points) continue;
    fiveYearAvg[name] = points.filter((p) => recentLabels.has(p.label));
  }

  const payload = {
    series: namedSeries,
    events: AGRO_EVENTS,
    fiveYearAvg,
    default0: namedSeries[0]?.name ?? 'Pšenice',
    // Flag for the chart so it knows to fetch the full file when the user
    // requests the "Vše" window.
    partial: true,
    windowMonths: RECENT_MONTHS,
  };
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};
