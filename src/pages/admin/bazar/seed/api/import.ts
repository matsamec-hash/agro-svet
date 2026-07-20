import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';
import { getEnvVar } from '../../../../../lib/env';
import { parseBazosListing } from '../../../../../lib/bazar-import-parse';
import { suggestCategory, matchBrand } from '../../../../../lib/bazar-import-category';
import { structureListing } from '../../../../../lib/bazar-import-structure';
import { createProspectWithDraft } from '../../../../../lib/bazar-seed';

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
      const buf = new Uint8Array(await res.arrayBuffer());
      const ext = (url.split('.').pop() || 'jpg').split('?')[0].slice(0, 4);
      const path = `seed/${crypto.randomUUID()}-${i}.${ext}`;
      const { error } = await supabase.storage.from('bazar-images').upload(path, buf, {
        contentType: res.headers.get('content-type') || 'image/jpeg',
      });
      if (error) {
        debug.push(`#${i}: upload "${error.message}"`);
        continue;
      }
      paths.push(path);
      debug.push(`#${i}: OK ${Math.round(buf.length / 1024)}KB`);
    } catch (e) {
      debug.push(`#${i}: threw "${(e as Error).message}"`);
    }
  }
  return { paths, debug };
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
  const url = typeof body?.url === 'string' ? body.url.trim() : '';
  const contact = body?.contact ?? {};
  if (!/^https?:\/\/.*bazos\.cz/i.test(url)) return json({ error: 'Zadejte platný odkaz na bazos.cz' }, 400);

  // Stažení stránky Bazoše — fetch může na produkčním Node serveru selhat
  // (egress / blokace datacentra), proto ho obalujeme a vracíme čitelný důvod.
  let html: string;
  try {
    const pageRes = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (agro-svet import)' } });
    if (!pageRes.ok) return json({ error: `Stránku se nepodařilo stáhnout (HTTP ${pageRes.status})` }, 502);
    html = await pageRes.text();
  } catch (e) {
    return json({ error: `Bazoš se ze serveru nepodařilo načíst: ${(e as Error).message}` }, 502);
  }

  const parsed = parseBazosListing(html);
  if (!parsed.title) return json({ error: 'Z inzerátu se nepodařilo přečíst název — zkuste zadat ručně.' }, 422);

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
      adminId: user.id,
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

    return json({
      ok: true,
      imageCount: imagePaths.length,
      imageUrlsFound: parsed.imageUrls.length,
      imageDebug,
      ...result,
    });
  } catch (e) {
    return json({ error: `Import selhal: ${(e as Error).message}` }, 500);
  }
};
