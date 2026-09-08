import type { APIRoute } from 'astro';
import statsData from '../../data/agro-stats.json';
import { commodityCsv, CSV_HEADERS, type CommoditySeries } from '../../lib/commodity-csv';

// Kompletní české cenové řady (9 komodit, měsíčně od 2010) v jednom CSV.
// Cílová URL pro Dataset.distribution na /statistiky/.
export const prerender = true;

export const GET: APIRoute = () => {
  const { commodityFull } = statsData as unknown as { commodityFull: CommoditySeries[] };
  return new Response(commodityCsv(commodityFull), {
    status: 200,
    headers: {
      ...CSV_HEADERS,
      'content-disposition': 'inline; filename="agro-svet-ceny-komodit.csv"',
    },
  });
};
