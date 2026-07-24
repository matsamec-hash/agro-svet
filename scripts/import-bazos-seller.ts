/**
 * Jednorázový import všech aktivních inzerátů jednoho prodejce z Bazoše do
 * neveřejné (pending_claim) části bazaru — pod JEDNOHO prospekta.
 *
 * Reuse ověřených lib funkcí (parse/structure/seed) — stejný flow jako admin
 * batch import, jen sekvenčně z CLI a vše pod jeden prospekt.
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
import { geocode } from '../src/lib/geocode';

type Supa = ReturnType<typeof createServerClient>;

async function downloadImages(supabase: Supa, urls: string[]): Promise<string[]> {
  const paths: string[] = [];
  for (const [i, url] of urls.slice(0, 5).entries()) {
    try {
      const res = await fetch(url, {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
          referer: 'https://www.bazos.cz/',
          accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
        },
      });
      if (!res.ok) { console.log(`    foto #${i}: HTTP ${res.status}`); continue; }
      const raw = Buffer.from(await res.arrayBuffer());
      let out: Buffer = raw;
      let cropped = false;
      try {
        const sharp = (await import('sharp')).default;
        const img = sharp(raw);
        const meta = await img.metadata();
        if (meta.height && meta.width) {
          const cropPx = Math.round(meta.height * 0.07);
          if (cropPx > 4 && meta.height - cropPx > 80) {
            out = await img.extract({ left: 0, top: 0, width: meta.width, height: meta.height - cropPx }).jpeg({ quality: 85 }).toBuffer();
            cropped = true;
          }
        }
      } catch { /* ořez best-effort */ }
      const path = `seed/${crypto.randomUUID()}-${i}.jpg`;
      const { error } = await supabase.storage.from('bazar-images').upload(path, out, { contentType: 'image/jpeg' });
      if (error) { console.log(`    foto #${i}: upload "${error.message}"`); continue; }
      paths.push(path);
      console.log(`    foto #${i}: OK ${Math.round(out.length / 1024)}KB${cropped ? ' (oříznuto)' : ''}`);
    } catch (e) {
      console.log(`    foto #${i}: throw "${(e as Error).message}"`);
    }
  }
  return paths;
}

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
      });
      const description = structured.features.length
        ? `${structured.description}\n\nVýbava: ${structured.features.join(' • ')}`
        : structured.description;

      const imagePaths = await downloadImages(supabase, parsed.imageUrls);

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
      }, imagePaths);
      ok++;
      console.log(`    ✓ „${structured.title}" — ${parsed.price ?? '?'} Kč, ${structured.category}${structured.brand ? '/' + structured.brand : ''}, ${imagePaths.length} foto → ${listingId}`);
    } catch (e) {
      console.log(`    ✗ ${(e as Error).message}`);
    }
    // šetrně k Bazoši
    await new Promise((r) => setTimeout(r, 800));
  }

  console.log(`\nHotovo: ${ok}/${urls.length} naimportováno pod prospekta ${prospectId}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
