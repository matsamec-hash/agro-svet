import type { APIRoute } from 'astro';
import statsData from '../../../data/agro-stats.json';
import { udrzovatelSlug } from '../../../lib/plodiny';
import { commodityCsv, CSV_HEADERS, type CommoditySeries } from '../../../lib/commodity-csv';

// Cenová řada jedné komodity. Slug se odvozuje stejně jako u HTML stránky
// (udrzovatelSlug), aby /statistiky/komodita/psenice/ a …/psenice.csv patřily
// k sobě — Dataset.distribution na detailu komodity míří sem.
export const prerender = true;

const SERIES = (statsData as unknown as { commodityFull: CommoditySeries[] }).commodityFull;

export function getStaticPaths() {
  return SERIES.map((s) => ({ params: { slug: udrzovatelSlug(s.name) } }));
}

export const GET: APIRoute = ({ params }) => {
  const series = SERIES.find((s) => udrzovatelSlug(s.name) === params.slug);
  if (!series) return new Response('Not found', { status: 404 });
  return new Response(commodityCsv([series]), {
    status: 200,
    headers: {
      ...CSV_HEADERS,
      'content-disposition': `inline; filename="agro-svet-${params.slug}.csv"`,
    },
  });
};
