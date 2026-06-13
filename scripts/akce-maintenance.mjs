// scripts/akce-maintenance.mjs
// Přepočítá pristi_vyskyt u zveřejněných akcí; jednorázové po termínu → 'probehla'.
// Spouštět cronem (CF Cron Trigger nebo GitHub Actions). Lokálně:
//   npm run akce:maintenance
import { createClient } from '@supabase/supabase-js';
import { computeNextOccurrence } from '../src/lib/akce-recurrence.ts';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) { console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_KEY'); process.exit(1); }
const sb = createClient(url, key);

const now = new Date();
const { data, error } = await sb.from('akce').select('*').eq('stav', 'zverejneno');
if (error) { console.error(error); process.exit(1); }

let updated = 0, expired = 0;
for (const a of data ?? []) {
  const t = a.druh === 'jednorazova'
    ? { druh: 'jednorazova', zacatek: a.zacatek, konec: a.konec }
    : { druh: 'opakovana', dny_v_tydnu: a.dny_v_tydnu ?? [], cas_od: a.cas_od ?? '00:00', cas_do: a.cas_do, plati_od: a.plati_od, plati_do: a.plati_do };
  const pristi = computeNextOccurrence(t, now);
  if (a.druh === 'jednorazova' && pristi === null) {
    await sb.from('akce').update({ stav: 'probehla', pristi_vyskyt: null, updated_at: now.toISOString() }).eq('id', a.id);
    expired++;
  } else {
    await sb.from('akce').update({ pristi_vyskyt: pristi, updated_at: now.toISOString() }).eq('id', a.id);
    updated++;
  }
}
console.log(`akce-maintenance: ${updated} přepočítáno, ${expired} → probehla`);
