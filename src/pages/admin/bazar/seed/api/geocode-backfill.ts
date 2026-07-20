import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';
import { geocode } from '../../../../../lib/geocode';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// Jednorázový admin backfill: dogeokóduje aktivní inzeráty bez souřadnic
// (typicky seedované z Bazoše, které se importovaly před doplněním geokódování).
// Middleware gate-uje /admin/* přes is_admin. Otevři v prohlížeči (GET).
export const GET: APIRoute = async ({ locals }) => {
  const user = (locals as any).user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const supabase = createServerClient();
  const { data: profile } = await supabase
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!(profile as { is_admin?: boolean } | null)?.is_admin) return json({ error: 'forbidden' }, 403);

  const { data: rows, error } = await supabase
    .from('bazar_listings')
    .select('id, title, location')
    .eq('status', 'active')
    .is('latitude', null)
    .limit(500);
  if (error) return json({ error: error.message }, 500);

  const results: { id: string; title: string; location: string | null; outcome: string }[] = [];
  for (const row of rows ?? []) {
    const location = (row as any).location as string | null;
    if (!location) {
      results.push({ id: row.id, title: row.title, location, outcome: 'skip: bez lokality' });
      continue;
    }
    try {
      const geo = await geocode({ location });
      if (geo && geo.lat >= 48 && geo.lat <= 51.5 && geo.lng >= 12 && geo.lng <= 19) {
        const { error: upErr } = await supabase
          .from('bazar_listings')
          .update({ latitude: geo.lat, longitude: geo.lng })
          .eq('id', row.id);
        results.push({
          id: row.id,
          title: row.title,
          location,
          outcome: upErr ? `chyba update: ${upErr.message}` : `OK (${geo.lat.toFixed(3)}, ${geo.lng.toFixed(3)}, ${geo.source})`,
        });
      } else {
        results.push({ id: row.id, title: row.title, location, outcome: 'nenalezeno v ČR' });
      }
    } catch (e) {
      results.push({ id: row.id, title: row.title, location, outcome: `geocode chyba: ${(e as Error).message}` });
    }
  }

  const updated = results.filter((r) => r.outcome.startsWith('OK')).length;
  return json({ ok: true, total: results.length, updated, results });
};
