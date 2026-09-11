/**
 * Jednorázový import všech aktivních inzerátů jednoho prodejce z Bazoše do
 * neveřejné (pending_claim) části bazaru — pod JEDNOHO prospekta.
 *
 * Reuse ověřených lib funkcí (parse/structure/seed) — stejný flow jako admin
 * batch import, jen sekvenčně z CLI a vše pod jeden prospekt.
 *
 * ‼️ Importuje se POUZE text inzerátu. Fotky zůstávají u prodejce — k cizím
 * snímkům nemáme licenci a dřívější varianta tohohle skriptu je navíc stahovala
 * s podvrženou hlavičkou prohlížeče a `sharp.extract()` z nich ořezávala spodní
 * pruh s vodoznakem. Odstranění informace o správě práv je samostatný delikt
 * podle § 43 autorského zákona. Svoje fotky si prodejce nahraje sám, až si
 * inzerát převezme.
 *
 * Env (nastav před spuštěním): SUPABASE_URL, SUPABASE_SERVICE_KEY (cílová DB =
 * self-host prod), OPENAI_API_KEY (AI strukturování; bez něj deterministický fallback).
 *
 * Spuštění:
 *   node_modules/.bin/tsx scripts/import-bazos-seller.ts <ADMIN_ID> <PROSPECT_NAME> <URL...>
 */
import { createServerClient } from '../src/lib/supabase';
import { getEnvVar } from '../src/lib/env';
import { parseBazosListing } from '../src/lib/bazar-import-parse';
import { suggestCategory, matchBrand } from '../src/lib/bazar-import-category';
import { structureListing } from '../src/lib/bazar-import-structure';
import { createProspect, addDraftListing } from '../src/lib/bazar-seed';
import { attributesForCategory } from '../src/lib/bazar-attributes';
import { geocode } from '../src/lib/geocode';

async function main() {
  const [adminId, prospectName, ...urls] = process.argv.slice(2);
  if (!adminId || !prospectName || urls.length === 0) {
    console.error('Použití: tsx scripts/import-bazos-seller.ts <ADMIN_ID> <PROSPECT_NAME> <URL...>');
    process.exit(1);
  }
  const supabase = createServerClient();
  const openaiKey = getEnvVar('OPENAI_API_KEY') ?? '';
  console.log(`AI strukturování: ${openaiKey ? 'ANO (OpenAI)' : 'NE (fallback)'}`);

  // 1) Jeden prázdný prospekt pro celého prodejce.
  const { prospectId, claimCode } = await createProspect(supabase, {
    adminId,
    prospect: { name: prospectName, phone: '', email: '' },
  });
  console.log(`\nProspekt „${prospectName}" založen: ${prospectId} (kód ${claimCode})\n`);

  let ok = 0;
  for (const [idx, url] of urls.entries()) {
    console.log(`[${idx + 1}/${urls.length}] ${url}`);
    try {
      const pageRes = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (agro-svet import)' } });
      if (!pageRes.ok) { console.log(`    ✗ stránka HTTP ${pageRes.status}`); continue; }
      const html = await pageRes.text();
      const parsed = parseBazosListing(html);
      if (!parsed.title) { console.log('    ✗ bez názvu, přeskočeno'); continue; }

      const structured = await structureListing({
        title: parsed.title,
        description: parsed.description ?? '',
        apiKey: openaiKey,
        fallback: {
          brand: matchBrand(parsed.title, parsed.description ?? ''),
          category: suggestCategory(parsed.title, parsed.description ?? ''),
          hours: parsed.hours,
        },
        categoryAttributes: attributesForCategory(suggestCategory(parsed.title, parsed.description ?? '')),
      });
      const description = structured.features.length
        ? `${structured.description}\n\nVýbava: ${structured.features.join(' • ')}`
        : structured.description;

      let latitude: number | null = null;
      let longitude: number | null = null;
      if (parsed.location) {
        try {
          const geo = await geocode({ location: parsed.location });
          if (geo && geo.lat >= 48 && geo.lat <= 51.5 && geo.lng >= 12 && geo.lng <= 19) {
            latitude = geo.lat; longitude = geo.lng;
          }
        } catch { /* geokód best-effort */ }
      }

      const listingId = await addDraftListing(supabase, prospectId, {
        title: structured.title,
        description,
        price: parsed.price,
        category: structured.category,
        brand: structured.brand,
        location: parsed.location ?? '',
        phone: parsed.phone ?? '',
        email: '',
        yearOfManufacture: structured.year,
        powerHp: structured.powerHp,
        hoursOperated: structured.hours,
        latitude,
        longitude,
        attributes: structured.attributes,
      });
      ok++;
      console.log(`    ✓ „${structured.title}" — ${parsed.price ?? '?'} Kč, ${structured.category}${structured.brand ? '/' + structured.brand : ''}, bez fotek (${parsed.imageUrls.length} zůstalo u prodejce) → ${listingId}`);
    } catch (e) {
      console.log(`    ✗ ${(e as Error).message}`);
    }
    // šetrně k Bazoši
    await new Promise((r) => setTimeout(r, 800));
  }

  console.log(`\nHotovo: ${ok}/${urls.length} naimportováno pod prospekta ${prospectId}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
