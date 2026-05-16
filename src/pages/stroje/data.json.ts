import type { APIRoute } from 'astro';
import { getAllModels } from '../../lib/stroje';

export const prerender = true;

export const GET: APIRoute = () => {
  const models = getAllModels();
  // Compact field names to shrink payload (~40% smaller than verbose keys).
  const compact = models.map((m) => ({
    s: m.slug,
    n: m.name,
    b: m.brand_slug,
    bn: m.brand_name,
    c: m.category,
    sr: m.series_slug,
    srn: m.series_name,
    yf: m.year_from,
    yt: m.year_to,
    hp: m.power_hp,
    kw: m.power_kw,
    cw: m.cutting_width_m ?? null,
  }));
  return new Response(JSON.stringify(compact), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};
