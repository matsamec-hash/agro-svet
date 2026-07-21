import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';
import { getEnvVar } from '../../../../../lib/env';
import { parseBazosListing } from '../../../../../lib/bazar-import-parse';
import { suggestCategory, matchBrand } from '../../../../../lib/bazar-import-category';
import { structureListing } from '../../../../../lib/bazar-import-structure';
import { createProspectWithDraft } from '../../../../../lib/bazar-seed';
import { parseBatchUrls } from '../../../../../lib/bazar-batch-urls';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

async function downloadImages(
  supabase: ReturnType<typeof createServerClient>,
  urls: string[],
): Promise<{ paths: string[]; debug: string[] }> {
  const paths: string[] = [];
  const debug: string[] = [];
  for (const [i, url] of urls.slice(0, 5).entries()) {
    try {
      // Hlavičky proti hotlink ochraně Bazoše (jinak www.bazos.cz může blokovat).
      const res = await fetch(url, {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
          referer: 'https://www.bazos.cz/',
          accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
        },
      });
      if (!res.ok) {
        debug.push(`#${i}: fetch HTTP ${res.status}`);
        continue;
      }
      const raw = Buffer.from(await res.arrayBuffer());
      // Ořízni spodní pruh s vodoznakem Bazoše (ve výšce loga). Přes sharp: uřízneme
      // spodní ~7 % výšky. Když sharp selže, nahrajeme originál (fotka je důležitější
      // než ořez). Výstup normalizujeme na JPEG.
      let out: Buffer = raw;
      let cropped = false;
      try {
        const sharp = (await import('sharp')).default;
        const img = sharp(raw);
        const meta = await img.metadata();
        if (meta.height && meta.width) {
          const cropPx = Math.round(meta.height * 0.07);
          if (cropPx > 4 && meta.height - cropPx > 80) {
            out = await img
              .extract({ left: 0, top: 0, width: meta.width, height: meta.height - cropPx })
              .jpeg({ quality: 85 })
              .toBuffer();
            cropped = true;
          }
        }
      } catch (e) {
        debug.push(`#${i}: ořez přeskočen (${(e as Error).message})`);
      }
      const path = `seed/${crypto.randomUUID()}-${i}.jpg`;
      const { error } = await supabase.storage.from('bazar-images').upload(path, out, {
        contentType: 'image/jpeg',
      });
      if (error) {
        debug.push(`#${i}: upload "${error.message}"`);
        continue;
      }
      paths.push(path);
      debug.push(`#${i}: OK ${Math.round(out.length / 1024)}KB${cropped ? ' (oříznuto)' : ''}`);
    } catch (e) {
      debug.push(`#${i}: threw "${(e as Error).message}"`);
    }
  }
  return { paths, debug };
}

type ImportOk = { ok: true; imageCount: number; imageUrlsFound: number; imageDebug: string[]; [k: string]: unknown };
type ImportErr = { ok: false; error: string; status: number };

/**
 * Import ONE bazos listing → pending_claim draft. Vrací strukturovaný výsledek
 * (ne Response), aby ho mohl volat single i batch režim. Chování je identické
 * s původním single-import flow (fetch → parse → AI → fotky → geocode → draft).
 */
async function importOne(
  supabase: ReturnType<typeof createServerClient>,
  url: string,
  contact: { name?: string; phone?: string; email?: string },
  adminId: string,
): Promise<ImportOk | ImportErr> {
  // Stažení stránky Bazoše — fetch může na produkčním Node serveru selhat
  // (egress / blokace datacentra), proto ho obalujeme a vracíme čitelný důvod.
  let html: string;
  try {
    const pageRes = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (agro-svet import)' } });
    if (!pageRes.ok) return { ok: false, error: `Stránku se nepodařilo stáhnout (HTTP ${pageRes.status})`, status: 502 };
    html = await pageRes.text();
  } catch (e) {
    return { ok: false, error: `Bazoš se ze serveru nepodařilo načíst: ${(e as Error).message}`, status: 502 };
  }

  const parsed = parseBazosListing(html);
  if (!parsed.title) return { ok: false, error: 'Z inzerátu se nepodařilo přečíst název — zkuste zadat ručně.', status: 422 };

  // Zbytek (AI přepis, stažení fotek, zápis draftu) — jakoukoli chybu vrátíme
  // jako čitelnou hlášku, ne jako neprůhledný 500.
  try {
    // AI (OpenAI) vytáhne strukturovaná pole + přepíše text; bez OPENAI_API_KEY se
    // použije deterministický fallback (značka/kategorie/motohodiny).
    const structured = await structureListing({
      title: parsed.title,
      description: parsed.description ?? '',
      apiKey: getEnvVar('OPENAI_API_KEY') ?? '',
      fallback: {
        brand: matchBrand(parsed.title, parsed.description ?? ''),
        category: suggestCategory(parsed.title, parsed.description ?? ''),
        hours: parsed.hours,
      },
    });

    // Vybavení (pokud AI nějaké vrátila) doplníme na konec popisu, ať se neztratí.
    const description = structured.features.length
      ? `${structured.description}\n\nVýbava: ${structured.features.join(' • ')}`
      : structured.description;

    const { paths: imagePaths, debug: imageDebug } = await downloadImages(supabase, parsed.imageUrls);

    // Orientační poloha pro mapu (centrum města / PSČ), ať se seedovaný inzerát
    // po zveřejnění zobrazí na /bazar/mapa. Bez souřadnic ho mapa nevykreslí.
    // Lokální lookup pokryje ~230 CZ měst instantně; cizí lokality → null (bez pinu).
    let latitude: number | null = null;
    let longitude: number | null = null;
    if (parsed.location) {
      try {
        const { geocode } = await import('../../../../../lib/geocode');
        const geo = await geocode({ location: parsed.location });
        // Držíme se v hrubých hranicích ČR — Nominatim může u cizí lokality vrátit
        // nesmysl; radši žádný pin než pin v moři.
        if (geo && geo.lat >= 48 && geo.lat <= 51.5 && geo.lng >= 12 && geo.lng <= 19) {
          latitude = geo.lat;
          longitude = geo.lng;
        }
      } catch (e) {
        console.warn('[bazar/seed/import] geocode failed', e);
      }
    }

    const result = await createProspectWithDraft(supabase, {
      adminId,
      prospect: {
        name: contact.name ?? '',
        phone: contact.phone ?? parsed.phone ?? '',
        email: contact.email ?? '',
        sourceUrl: url,
      },
      listing: {
        title: structured.title,
        description,
        price: parsed.price,
        category: structured.category,
        brand: structured.brand,
        location: parsed.location ?? '',
        phone: contact.phone ?? parsed.phone ?? '',
        email: contact.email ?? '',
        yearOfManufacture: structured.year,
        powerHp: structured.powerHp,
        hoursOperated: structured.hours,
        latitude,
        longitude,
      },
      imagePaths,
    });

    return { ok: true, title: structured.title, imageCount: imagePaths.length, imageUrlsFound: parsed.imageUrls.length, imageDebug, ...result };
  } catch (e) {
    return { ok: false, error: `Import selhal: ${(e as Error).message}`, status: 500 };
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const supabase = createServerClient();

  // Defense in depth — middleware /admin/* už checkuje is_admin (locals.user
  // nemá is_admin, ten žije v bazar_users; viz ostatní admin API routy).
  const { data: profile } = await supabase
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!(profile as { is_admin?: boolean } | null)?.is_admin) return json({ error: 'forbidden' }, 403);

  const body = await request.json().catch(() => null);
  const contact = body?.contact ?? {};

  // Batch režim: `urls` = blob vložených odkazů (víc na řádcích / oddělené čárkami).
  // Projede se STEJNÝM ověřeným flow jako single, sekvenčně (šetrně k Bazoši),
  // s tvrdým capem v parseBatchUrls. Kontakt se nechává prázdný → použije se
  // telefon z inzerátu (parsed.phone).
  const rawBatch = typeof body?.urls === 'string'
    ? body.urls
    : Array.isArray(body?.urls) ? body.urls.join('\n') : '';
  const batchUrls = parseBatchUrls(rawBatch);
  if (batchUrls.length > 0) {
    const results: Array<{ url: string } & (ImportOk | ImportErr)> = [];
    for (const u of batchUrls) {
      results.push({ url: u, ...(await importOne(supabase, u, contact, user.id)) });
    }
    const succeeded = results.filter((r) => r.ok).length;
    return json({ batch: true, total: results.length, succeeded, failed: results.length - succeeded, results });
  }

  // Single režim (zpětně kompatibilní — identická odpověď jako dřív).
  const url = typeof body?.url === 'string' ? body.url.trim() : '';
  if (!/^https?:\/\/.*bazos\.cz/i.test(url)) return json({ error: 'Zadejte platný odkaz na bazos.cz' }, 400);
  const r = await importOne(supabase, url, contact, user.id);
  return r.ok ? json(r) : json({ error: r.error }, r.status);
};
