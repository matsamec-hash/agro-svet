// GET /api/admin/metrics/ — agregátor metrik pro samec-digital dashboard widget.
//
// Auth: Authorization: Bearer ${ADMIN_METRICS_TOKEN}. Bez tokenu 401.
// CORS: povoluje samecdigital.com origin pro browser fetch ze Svelte widgetu.
//
// Vrací JSON s:
// - saved_searches: count by status + confirmed/pending
// - featured_orders: count by status
// - bazar_listings: active + with_coords + last 24h
// - content: tier-lists count, slovnik count, encyklopedie count
// - timestamp
//
// Performance: parallel Supabase HEAD count queries, cached 5 min na edge.

import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEnvVar } from '../../../lib/env';

export const prerender = false;

const ALLOWED_ORIGINS = new Set([
  'https://samecdigital.com',
  'https://www.samecdigital.com',
  'http://localhost:4321',
  'http://localhost:3000',
]);

function cors(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://samecdigital.com';
  return {
    'access-control-allow-origin': allowed,
    'access-control-allow-headers': 'authorization, content-type',
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-max-age': '86400',
    vary: 'origin',
  };
}

export const OPTIONS: APIRoute = ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: cors(request.headers.get('origin')),
  });
};

async function countByStatus(sb: any, table: string, statusCol: string): Promise<Record<string, number>> {
  const { data } = await sb.from(table).select(statusCol);
  const counts: Record<string, number> = {};
  for (const row of (data ?? [])) {
    const key = (row as any)[statusCol] ?? 'unknown';
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

async function plainCount(sb: any, table: string, filters: ((q: any) => any)[] = []): Promise<number> {
  let q = sb.from(table).select('*', { count: 'exact', head: true });
  for (const f of filters) q = f(q);
  const { count } = await q;
  return count ?? 0;
}

export const GET: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  const corsHeaders = cors(origin);

  const expected = getEnvVar('ADMIN_METRICS_TOKEN');
  if (!expected) {
    return new Response(JSON.stringify({ error: 'ADMIN_METRICS_TOKEN env not set' }), {
      status: 503,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  }
  const auth = request.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${expected}`) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  }

  const sb = createServerClient();
  const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  try {
    const [
      savedSearchesByStatus,
      savedSearchesConfirmedCount,
      featuredOrdersByStatus,
      bazarActiveCount,
      bazarWithCoordsCount,
      bazarLast24hCount,
      bazarFeaturedActiveCount,
    ] = await Promise.all([
      countByStatus(sb, 'bazar_saved_searches', 'status'),
      plainCount(sb, 'bazar_saved_searches', [(q) => q.eq('confirmed', true).eq('status', 'active')]),
      countByStatus(sb, 'bazar_featured_orders', 'status'),
      plainCount(sb, 'bazar_listings', [(q) => q.eq('status', 'active')]),
      plainCount(sb, 'bazar_listings', [(q) => q.eq('status', 'active').not('latitude', 'is', null)]),
      plainCount(sb, 'bazar_listings', [(q) => q.gt('created_at', sinceIso)]),
      plainCount(sb, 'bazar_listings', [
        (q) => q.eq('featured', true).gt('featured_until', new Date().toISOString()),
      ]),
    ]);

    // Pull static content counts cheaply.
    const { TIER_LISTS } = await import('../../../lib/tier-lists');
    const { SLOVNIK } = await import('../../../lib/slovnik');
    const { getAllModels, getAllBrands } = await import('../../../lib/stroje');
    const allModels = getAllModels();
    const allBrands = getAllBrands();

    const body = {
      ok: true,
      generated_at: new Date().toISOString(),
      saved_searches: {
        by_status: savedSearchesByStatus,
        active_confirmed: savedSearchesConfirmedCount,
        total: Object.values(savedSearchesByStatus).reduce((a, b) => a + b, 0),
      },
      featured_orders: {
        by_status: featuredOrdersByStatus,
        pending: featuredOrdersByStatus.pending ?? 0,
        paid: (featuredOrdersByStatus.paid ?? 0) + (featuredOrdersByStatus.free ?? 0),
        total: Object.values(featuredOrdersByStatus).reduce((a, b) => a + b, 0),
      },
      bazar: {
        active_listings: bazarActiveCount,
        with_coords: bazarWithCoordsCount,
        last_24h: bazarLast24hCount,
        currently_featured: bazarFeaturedActiveCount,
      },
      content: {
        tier_lists: TIER_LISTS.length,
        slovnik_terms: SLOVNIK.length,
        models: allModels.length,
        brands: allBrands.length,
      },
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        // Krátká cache — chceme aktuální data v dashboardu, ale ne zatěžovat
        // DB každým reloadem.
        'cache-control': 'private, max-age=60',
        ...corsHeaders,
      },
    });
  } catch (e) {
    console.error('[admin/metrics] failed', e);
    return new Response(JSON.stringify({ error: 'db_error', message: String(e).slice(0, 200) }), {
      status: 500,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  }
};
