// Vyprázdní `bazar-images/seed/` — fotky seškrábané z cizích inzerátů.
//
// Kontrola 11. 9. 2026 (po advokátní výzvě PhotoClaim na svetovestadiony.cz):
// importér Bazoše stahoval fotky prodejců s podvrženou hlavičkou prohlížeče,
// `sharp.extract()` z nich uřízl spodních ~7 % výšky (tam je vodoznak) a soubor
// nahrál do našeho bucketu. K těm snímkům nemáme licenci ani od prodejce, ani
// od provozovatele inzertního serveru; odstranění informace o správě práv je
// navíc samostatný delikt podle § 43 autorského zákona.
//
// Bucket `bazar-images` je `public=true`, takže RLS na webu inzeráty skryje,
// ale soubory samotné vrací veřejná URL s HTTP 200 — smazání řádku v DB tedy
// nestačí, musí pryč i soubor. Po převzetí inzerátu (`/bazar/prevzit/<token>`)
// by se navíc zveřejnily úplně.
//
// Text inzerátů (`bazar_listings`, status `pending_claim`) se ZÁMĚRNĚ nemaže —
// vadné jsou fotky, ne popis stroje. Fotky si k inzerátu nahraje prodejce sám,
// až si ho převezme.
//
// Spuštění (self-hosted DB, kde běží produkce):
//   node --env-file=.env.selfhost scripts/bazar-seed-foto-cleanup.mjs [--apply]

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

// 1) Soubory v bucketu. Mažou se VŠECHNY v `seed/`, i ty, ke kterým už řádek
//    v `bazar_images` není — osiřelý soubor je na veřejné URL stejně dostupný.
const { data: files, error: fErr } = await sb.storage.from('bazar-images').list('seed', { limit: 1000 });
if (fErr) { console.error('storage.list:', fErr); process.exit(1); }
const filePaths = (files ?? []).map((f) => `seed/${f.name}`);

// 2) Řádky v DB, které na `seed/` ukazují.
const { data: rows, error: rErr } = await sb
  .from('bazar_images')
  .select('id, listing_id, storage_path')
  .like('storage_path', 'seed/%');
if (rErr) { console.error('bazar_images.select:', rErr); process.exit(1); }

const listingIds = [...new Set((rows ?? []).map((r) => r.listing_id))];
console.log(`\nsoubory v seed/: ${filePaths.length}`);
console.log(`řádky v bazar_images: ${rows?.length ?? 0} (u ${listingIds.length} inzerátů)`);
const bezRadku = filePaths.filter((p) => !(rows ?? []).some((r) => r.storage_path === p));
console.log(`z toho osiřelých souborů bez řádku: ${bezRadku.length}`);

if (!filePaths.length && !(rows ?? []).length) {
  console.log('Není co mazat.');
  process.exit(0);
}

if (!APPLY) {
  console.log('\nSpusť znovu s --apply.');
  process.exit(0);
}

if (filePaths.length) {
  // storage.remove bere dávky; 1 000 cest je nad limitem jednoho requestu.
  for (let i = 0; i < filePaths.length; i += 100) {
    const { error } = await sb.storage.from('bazar-images').remove(filePaths.slice(i, i + 100));
    if (error) { console.error('storage.remove:', error); process.exit(1); }
  }
  console.log(`✓ storage: smazáno ${filePaths.length} souborů`);
}

if ((rows ?? []).length) {
  const { error } = await sb.from('bazar_images').delete().in('id', rows.map((r) => r.id));
  if (error) { console.error('bazar_images.delete:', error); process.exit(1); }
  console.log(`✓ bazar_images: smazáno ${rows.length} řádků`);
}

// 3) Ověření — nic nesmí zůstat ani v tabulce, ani v bucketu, a veřejná URL
//    prvního smazaného souboru musí přestat vracet 200.
const { data: zbytekRows } = await sb.from('bazar_images').select('id').like('storage_path', 'seed/%');
const { data: zbytekFiles } = await sb.storage.from('bazar-images').list('seed', { limit: 1000 });
console.log(`\nPo úklidu: bazar_images(seed/)=${zbytekRows?.length ?? 0} řádků, storage seed/=${zbytekFiles?.length ?? 0} souborů`);
if (filePaths[0]) {
  const url = sb.storage.from('bazar-images').getPublicUrl(filePaths[0]).data.publicUrl;
  const res = await fetch(url, { method: 'HEAD' });
  console.log(`veřejná URL vzorku: HTTP ${res.status} (očekáváno 400/404) — ${url}`);
}
