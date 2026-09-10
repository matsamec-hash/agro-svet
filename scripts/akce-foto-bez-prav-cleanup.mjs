// Smaže fotky u akcí, ke kterým nemáme práva.
//
// Kontrola 10. 9. 2026 (po advokátní výzvě PhotoClaim na svetovestadiony.cz):
// všech 5 obrázků v bucketu `akce-images` jsou propagační materiály pořadatelů
// stažené z jejich webů — plakát Den Zemědělce (denzemedelce.cz, 2×), banner
// Země živitelka 52, banner Floria Léto (Výstaviště Kroměříž) a fotka koně
// z vll.cz, která má přímo v rohu vypálený kredit fotografa. Ani u jednoho
// nemáme licenci. Vložil je admin (info@samecdigital.com), nejde tedy o obsah
// nahraný pořadatelem přes veřejný formulář.
//
// Smaže se řádek v `akce_images`, `akce.foto_path` se vynuluje a soubor jde
// pryč i ze storage — samotné odstranění z databáze nestačí, veřejná URL
// v bucketu by fotku servírovala dál.
//
// Spuštění (self-hosted DB, kde běží produkce):
//   node --env-file=.env.selfhost scripts/akce-foto-bez-prav-cleanup.mjs [--apply]

import { createClient } from '@supabase/supabase-js';

const URL = process.env.SH_SUPABASE_URL ?? process.env.SUPABASE_URL;
const KEY = process.env.SH_SUPABASE_KEY ?? process.env.SUPABASE_SERVICE_KEY;
if (!URL || !KEY) {
  console.error('Chybí SH_SUPABASE_URL / SH_SUPABASE_KEY (nebo SUPABASE_URL / SUPABASE_SERVICE_KEY).');
  process.exit(1);
}
const APPLY = process.argv.includes('--apply');
const sb = createClient(URL, KEY);
console.log(`DB: ${URL} | režim: ${APPLY ? 'APPLY' : 'DRY-RUN'}`);

const { data: imgs, error } = await sb.from('akce_images').select('id, akce_id, storage_path');
if (error) { console.error(error); process.exit(1); }
if (!imgs?.length) { console.log('Bucket akce-images je prázdný, není co mazat.'); process.exit(0); }

const { data: akce } = await sb.from('akce').select('id, slug, web, email, foto_path');
const bySlug = new Map((akce ?? []).map((a) => [a.id, a]));

for (const i of imgs) {
  const a = bySlug.get(i.akce_id);
  console.log(`  ${i.storage_path}  ←  ${a?.slug ?? '(akce smazána)'}  ${a?.web ?? ''}`);
}

if (!APPLY) {
  console.log(`\n${imgs.length} obrázků ke smazání. Spusť znovu s --apply.`);
  process.exit(0);
}

const paths = imgs.map((i) => i.storage_path);
const { error: sErr } = await sb.storage.from('akce-images').remove(paths);
if (sErr) { console.error('storage.remove:', sErr); process.exit(1); }
console.log(`✓ storage: smazáno ${paths.length} souborů`);

const { error: iErr } = await sb.from('akce_images').delete().in('id', imgs.map((i) => i.id));
if (iErr) { console.error('akce_images.delete:', iErr); process.exit(1); }
console.log(`✓ akce_images: smazáno ${imgs.length} řádků`);

const { error: aErr } = await sb.from('akce').update({ foto_path: null }).not('foto_path', 'is', null);
if (aErr) { console.error('akce.update:', aErr); process.exit(1); }
console.log('✓ akce.foto_path vynulováno');

// Ověření: nic nesmí zůstat ani v tabulce, ani v bucketu.
const { data: zbytek } = await sb.from('akce_images').select('id');
const { data: files } = await sb.storage.from('akce-images').list('', { limit: 100 });
console.log(`\nPo úklidu: akce_images=${zbytek?.length ?? 0} řádků, storage=${files?.length ?? 0} souborů`);
