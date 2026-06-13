import type { APIRoute } from 'astro';
import { listUpcoming } from '../../../lib/akce-supabase';
import { akceInSeason, getSeason } from '../../../lib/sezona';
import { formatTermin, type TerminInput } from '../../../lib/akce-recurrence';
import type { Akce } from '../../../lib/akce';

export const prerender = false;

const MAX_ITEMS = 8;

function terminText(a: Akce): string {
  const t: TerminInput = a.druh === 'jednorazova'
    ? { druh: 'jednorazova', zacatek: a.zacatek as string, konec: a.konec }
    : { druh: 'opakovana', dny_v_tydnu: a.dny_v_tydnu ?? [], cas_od: a.cas_od ?? '', cas_do: a.cas_do, plati_od: a.plati_od as string, plati_do: a.plati_do };
  return formatTermin(t);
}

export const GET: APIRoute = async ({ params }) => {
  const season = params.season ?? '';
  if (!getSeason(season)) {
    return new Response(JSON.stringify({ error: 'unknown season' }), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const all = await listUpcoming(200);
  const filtered = akceInSeason(all, season as 'jaro' | 'leto' | 'podzim' | 'zima', new Date()).slice(0, MAX_ITEMS);
  const payload = filtered.map((a) => ({
    slug: a.slug,
    nazev: a.nazev,
    terminText: terminText(a),
    obec: a.obec,
    typ: a.typ,
  }));

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=600, s-maxage=1800, stale-while-revalidate=86400',
    },
  });
};
