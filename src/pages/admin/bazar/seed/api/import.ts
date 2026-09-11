import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';
import { getEnvVar } from '../../../../../lib/env';
import { parseBazosListing } from '../../../../../lib/bazar-import-parse';
import { suggestCategory, matchBrand } from '../../../../../lib/bazar-import-category';
import { structureListing } from '../../../../../lib/bazar-import-structure';
import { createProspectWithDraft, addDraftListing } from '../../../../../lib/bazar-seed';
import { parseBatchUrls } from '../../../../../lib/bazar-batch-urls';
import { attributesForCategory } from '../../../../../lib/bazar-attributes';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

type ImportOk = { ok: true; photosLeftAtSeller: number; [k: string]: unknown };
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
  targetProspectId?: string,
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
      categoryAttributes: attributesForCategory(suggestCategory(parsed.title, parsed.description ?? '')),
    });

    // Vybavení (pokud AI nějaké vrátila) doplníme na konec popisu, ať se neztratí.
    const description = structured.features.length
      ? `${structured.description}\n\nVýbava: ${structured.features.join(' • ')}`
      : structured.description;

    // Fotky se ZÁMĚRNĚ nestahují. Dřív se tady s podvrženou hlavičkou prohlížeče
    // stáhla cizí fotka z Bazoše, `sharp.extract()` uřízl spodních ~7 % výšky
    // (tam je vodoznak) a výsledek se nahrál do našeho bucketu. Odstranění
    // informace o správě práv je samostatný delikt podle § 43 autorského zákona
    // a k samotné fotce nemáme licenci ani od prodejce, ani od Bazoše.
    // Fotka zůstává u prodejce; svoje fotky si k inzerátu nahraje sám, až si ho
    // převezme (`/bazar/prevzit/<token>`). Počet fotek jen ohlásíme.
    const photosLeftAtSeller = parsed.imageUrls.length;

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

    if (targetProspectId) {
      const listingId = await addDraftListing(supabase, targetProspectId, {
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
        attributes: structured.attributes,
      });
      return { ok: true, title: structured.title, photosLeftAtSeller, prospectId: targetProspectId, listingId };
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
        attributes: structured.attributes,
      },
    });

    return { ok: true, title: structured.title, photosLeftAtSeller, ...result };
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
  const targetProspectId = typeof body?.prospectId === 'string' && body.prospectId ? body.prospectId : undefined;

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
      results.push({ url: u, ...(await importOne(supabase, u, contact, user.id, targetProspectId)) });
    }
    const succeeded = results.filter((r) => r.ok).length;
    return json({ batch: true, total: results.length, succeeded, failed: results.length - succeeded, results });
  }

  // Single režim (zpětně kompatibilní — identická odpověď jako dřív).
  const url = typeof body?.url === 'string' ? body.url.trim() : '';
  if (!/^https?:\/\/.*bazos\.cz/i.test(url)) return json({ error: 'Zadejte platný odkaz na bazos.cz' }, 400);
  const r = await importOne(supabase, url, contact, user.id, targetProspectId);
  return r.ok ? json(r) : json({ error: r.error }, r.status);
};
