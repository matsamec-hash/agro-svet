// GET /api/cron/akce-maintenance — přepočte pristi_vyskyt zveřejněných akcí;
// jednorázové po termínu → stav='probehla'. Autentizace: Authorization: Bearer ${CRON_SECRET}.
// Volá denně GitHub Action (cron-akce-maintenance.yml). Logika = scripts/akce-maintenance.mjs.
import type { APIRoute } from 'astro';
import { listPublishedForMaintenance, applyMaintenance } from '../../../lib/akce-supabase';
import { getEnvVar } from '../../../lib/env';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const expected = getEnvVar('CRON_SECRET');
  if (!expected) return new Response('CRON_SECRET env not set', { status: 503 });
  const auth = request.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${expected}`) return new Response('Unauthorized', { status: 401 });

  const now = new Date();
  const akce = await listPublishedForMaintenance();
  for (const a of akce) {
    await applyMaintenance(a, now);
  }
  return new Response(JSON.stringify({ ok: true, processed: akce.length }), {
    status: 200, headers: { 'content-type': 'application/json' },
  });
};
