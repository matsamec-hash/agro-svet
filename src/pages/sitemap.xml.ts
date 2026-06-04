import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllBrands, getAllModels, seriesFamily, FUNCTIONAL_GROUPS } from '../lib/stroje';
import { getAllDruhy } from '../lib/plemena';
import { getAllFarms, regionsWithEnoughFarms } from '../lib/farmy';
import { getAllVcely, getAllVybaveni, getAllMed } from '../lib/vcelarstvi';
import { expandedComparisonPairs } from '../lib/comparator';
import { createAnonClient } from '../lib/supabase';
import { AGRO_SVET_SITE_ID as NOVINKY_SITE_ID, SITE_URL } from '../lib/config';
import { isSkLaunchedPath } from '../i18n/utils';
import { isLockedSectionPath } from '../i18n/nav';

const NOVINKY_CATEGORIES = ['technika', 'dotace', 'trh', 'legislativa', 'znacky', 'novinky'];

function maxIsoDate(values: Array<string | null | undefined>): string | undefined {
  let max: string | undefined;
  for (const v of values) {
    if (!v) continue;
    const d = v.slice(0, 10);
    if (!max || d > max) max = d;
  }
  return max;
}

interface UrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: string;
  /** Image URLs to expose via image:image — feeds Google Images and Lens. */
  images?: string[];
}

const XML_ESCAPES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
};

function xmlEscape(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => XML_ESCAPES[c]);
}

function absImage(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function renderUrl(u: UrlEntry): string {
  const parts = [`    <loc>${xmlEscape(u.loc)}</loc>`];
  if (u.lastmod) parts.push(`    <lastmod>${u.lastmod.slice(0, 10)}</lastmod>`);
  if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
  if (u.priority) parts.push(`    <priority>${u.priority}</priority>`);
  if (u.images && u.images.length > 0) {
    for (const img of u.images) {
      parts.push(`    <image:image>\n      <image:loc>${xmlEscape(absImage(img))}</image:loc>\n    </image:image>`);
    }
  }
  return `  <url>\n${parts.join('\n')}\n  </url>`;
}

export const GET: APIRoute = async () => {
  // Request-time current date. MUST be computed inside the handler — Cloudflare
  // Workers pin Date.now() to 0 at module-load time (security/spectre mitigation),
  // so a module-level `new Date()` would emit "1970-01-01" lastmod across the
  // sitemap. Inside a request handler Date.now() returns the wallclock time as
  // expected.
  const STATIC_LASTMOD = new Date().toISOString().slice(0, 10);

  const urls: UrlEntry[] = [];

  // Pull dynamic content FIRST — sequential (not Promise.all) because parallel
  // Supabase queries previously failed silently and left novinky out of sitemap.
  // Matches the proven pattern in news-sitemap.xml.ts.
  const supabase = createAnonClient();
  const articlesRes = await supabase
    .from('articles')
    .select('slug, published_at')
    .eq('site_id', NOVINKY_SITE_ID)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(2000);
  if (articlesRes.error) console.error('sitemap articles query error', articlesRes.error);
  const articlesDyn = articlesRes.data ?? [];

  const listingsRes = await supabase
    .from('bazar_listings')
    .select('id, updated_at, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(2000);
  if (listingsRes.error) console.error('sitemap bazar query error', listingsRes.error);
  const listingsDyn = listingsRes.data ?? [];

  // Hub pages whose freshness is driven by dynamic content underneath them.
  const latestArticleLastmod = maxIsoDate(articlesDyn.map((a) => (a as { published_at?: string }).published_at));
  const latestListingLastmod = maxIsoDate(
    listingsDyn.map((l) => (l as { updated_at?: string }).updated_at || (l as { created_at?: string }).created_at),
  );
  const homepageLastmod = latestArticleLastmod ?? STATIC_LASTMOD;

  const staticPaths: Array<[string, UrlEntry['changefreq'], string?, string?]> = [
    ['/', 'daily', '1.0', homepageLastmod],
    ['/novinky/', 'daily', '0.9', latestArticleLastmod ?? STATIC_LASTMOD],
    ['/bazar/', 'daily', '0.7', latestListingLastmod ?? STATIC_LASTMOD],
    ['/bazar/mapa/', 'daily', '0.65', latestListingLastmod ?? STATIC_LASTMOD],
    ['/bazar/sledovani/', 'monthly', '0.6', STATIC_LASTMOD],
    ['/bazar/topovani/', 'monthly', '0.65', STATIC_LASTMOD],
    ['/bazar/kraj/', 'weekly', '0.7', latestListingLastmod ?? STATIC_LASTMOD],
    ['/stroje/', 'weekly', '0.9', STATIC_LASTMOD],
    ['/farmy/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/stroje/traktory/', 'weekly', undefined, STATIC_LASTMOD],
    ['/stroje/kombajny/', 'weekly', undefined, STATIC_LASTMOD],
    ['/stroje/zemedelske-stroje/', 'weekly', '0.85', STATIC_LASTMOD],
    ['/znacky/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/encyklopedie/', 'weekly', undefined, STATIC_LASTMOD],
    ['/plemena/', 'weekly', undefined, STATIC_LASTMOD],
    ['/vcelarstvi/', 'weekly', '0.85', STATIC_LASTMOD],
    ['/vcelarstvi/druhy/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/vcelarstvi/vybaveni/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/vcelarstvi/med/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/kviz/jaka-vcela-pro-vas/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/puda/', 'weekly', undefined, STATIC_LASTMOD],
    ['/fotosoutez/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/fotosoutez/archiv/', 'monthly', undefined, STATIC_LASTMOD],
    ['/fotosoutez/pravidla/', 'yearly', undefined, STATIC_LASTMOD],
    ['/fotosoutez/gdpr/', 'yearly', undefined, STATIC_LASTMOD],
    ['/statistiky/', 'weekly', undefined, STATIC_LASTMOD],
    ['/srovnani/', 'weekly', '0.85', STATIC_LASTMOD],
    ['/zebricky/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/slovnik/', 'monthly', '0.75', STATIC_LASTMOD],
    ['/kviz/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/kviz/historie-znacek/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/kviz/jaky-traktor-potrebujete/', 'monthly', '0.8', STATIC_LASTMOD],
    ['/kalkulacka/', 'monthly', '0.8', STATIC_LASTMOD],
    ['/kalkulacka/prevody-jednotek/', 'monthly', '0.75', STATIC_LASTMOD],
    ['/kalkulacka/prevody-hmotnost/', 'monthly', '0.75', STATIC_LASTMOD],
    ['/kalkulacka/leasing-traktoru/', 'monthly', '0.75', STATIC_LASTMOD],
    ['/kalkulacka/naklady-na-hektar/', 'monthly', '0.75', STATIC_LASTMOD],
    ['/kalkulacka/dotace-cap/', 'monthly', '0.8', STATIC_LASTMOD],
    ['/kalkulacka/uspora-nafty/', 'monthly', '0.75', STATIC_LASTMOD],
    ['/prodejci/', 'monthly', '0.8', STATIC_LASTMOD],
    ['/dotace/', 'weekly', '0.85', STATIC_LASTMOD],
    ['/dotace/kalendar-kol/', 'weekly', '0.75', STATIC_LASTMOD],
    ['/jak-na-to/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/media/', 'monthly', undefined, STATIC_LASTMOD],
    ['/redakce/', 'monthly', '0.5', STATIC_LASTMOD],
    ['/podminky-pouziti/', 'yearly', '0.3', STATIC_LASTMOD],
    ['/zpracovani-osobnich-udaju/', 'yearly', '0.3', STATIC_LASTMOD],
    ['/dsa-kontakt/', 'yearly', '0.3', STATIC_LASTMOD],
    ['/prehled/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/prehled/nejprodavanejsi-traktory-2025/', 'yearly', '0.8', STATIC_LASTMOD],
    ['/pruvodce/', 'monthly', '0.8', STATIC_LASTMOD],
    ['/pruvodce/jak-vybrat-traktor-100-150-koni/', 'monthly', '0.85', STATIC_LASTMOD],
    ['/pruvodce/jak-vybrat-kombajn-stredni-farma/', 'monthly', '0.85', STATIC_LASTMOD],
    ['/pruvodce/kontrola-ojeteho-traktoru/', 'monthly', '0.85', STATIC_LASTMOD],
    ['/pruvodce/prvni-traktor-mlady-zemedelec/', 'monthly', '0.85', STATIC_LASTMOD],
    ['/pruvodce/jak-vybrat-seci-stroj/', 'monthly', '0.85', STATIC_LASTMOD],
    ['/pruvodce/jak-vybrat-postrikovac/', 'monthly', '0.85', STATIC_LASTMOD],
    ['/pruvodce/jak-vybrat-lis-na-baliky/', 'monthly', '0.85', STATIC_LASTMOD],
    ['/pruvodce/jak-vybrat-rozmetadlo-hnojiv/', 'monthly', '0.85', STATIC_LASTMOD],
  ];
  for (const [path, changefreq, priority, lastmod] of staticPaths) {
    urls.push({ loc: `${SITE_URL}${path}`, changefreq, priority, lastmod });
  }

  for (const cat of NOVINKY_CATEGORIES) {
    urls.push({ loc: `${SITE_URL}/novinky/kategorie/${cat}/`, changefreq: 'weekly', lastmod: latestArticleLastmod ?? STATIC_LASTMOD });
  }

  // Žebříčky — top-N seznamy generované z stroje dat.
  const { TIER_LISTS } = await import('../lib/tier-lists');
  for (const t of TIER_LISTS) {
    urls.push({ loc: `${SITE_URL}/zebricky/${t.slug}/`, changefreq: 'weekly', priority: '0.75', lastmod: STATIC_LASTMOD });
  }

  // Slovník zemědělských pojmů.
  const { SLOVNIK } = await import('../lib/slovnik');
  for (const term of SLOVNIK) {
    urls.push({ loc: `${SITE_URL}/slovnik/${term.slug}/`, changefreq: 'monthly', priority: '0.6', lastmod: STATIC_LASTMOD });
  }

  // Kraj-level lokální bazar landing pages.
  const { KRAJE } = await import('../lib/cap-dotace');
  for (const k of KRAJE) {
    urls.push({ loc: `${SITE_URL}/bazar/kraj/${k.slug}/`, changefreq: 'weekly', priority: '0.65', lastmod: latestListingLastmod ?? STATIC_LASTMOD });
  }

  // Stroje funkční skupiny (hub → groups) — pouze skupiny s modely.
  // Prázdné skupiny jsou skryté i v UI; vrátíme až budou naplněné (viz project memory).
  // Use effective_category — Kverneland-style brands ("zpracovani-pudy" top-level + series.subcategory)
  // map to subcategory slugs, not their top-level group key.
  const allStrojeModels = getAllModels().filter(
    (m) => m.effective_category !== 'traktory' && m.effective_category !== 'kombajny',
  );
  const groupsWithModels = (Object.entries(FUNCTIONAL_GROUPS) as [string, typeof FUNCTIONAL_GROUPS[keyof typeof FUNCTIONAL_GROUPS]][])
    .filter(([_, group]) => allStrojeModels.some((m) => (group.categories as readonly string[]).includes(m.effective_category)));
  for (const [groupSlug] of groupsWithModels) {
    urls.push({ loc: `${SITE_URL}/stroje/zemedelske-stroje/${groupSlug}/`, changefreq: 'weekly', priority: '0.75', lastmod: STATIC_LASTMOD });
  }

  // Stroje sub-kategorie (cross-brand pages /stroje/<subcategory>/) — pouze ty s modely
  // a které jsou v FUNCTIONAL_GROUPS.categories (jen ty mají route v [subcategory]/index.astro).
  const routableSubcats = new Set(Object.values(FUNCTIONAL_GROUPS).flatMap((g) => g.categories as readonly string[]));
  const subcategoriesWithModels = new Set(allStrojeModels.map((m) => m.effective_category));
  for (const subcat of subcategoriesWithModels) {
    if (!routableSubcats.has(subcat)) continue;
    urls.push({ loc: `${SITE_URL}/stroje/${subcat}/`, changefreq: 'weekly', priority: '0.7', lastmod: STATIC_LASTMOD });
  }

  for (const brand of getAllBrands()) {
    urls.push({ loc: `${SITE_URL}/stroje/${brand.slug}/`, changefreq: 'monthly', priority: '0.7', lastmod: STATIC_LASTMOD });
    for (const [catKey, cat] of Object.entries(brand.categories || {})) {
      const families = new Set<string>();
      for (const s of cat.series || []) {
        families.add(s.family || seriesFamily(s.slug));
        const seriesImg = s.image_url;
        urls.push({
          loc: `${SITE_URL}/stroje/${brand.slug}/${s.slug}/`,
          changefreq: 'monthly',
          lastmod: STATIC_LASTMOD,
          images: seriesImg ? [seriesImg] : undefined,
        });
        for (const m of s.models || []) {
          const short = m.slug.startsWith(brand.slug + '-') ? m.slug.slice(brand.slug.length + 1) : m.slug;
          const modelImg = m.image_url;
          const fallback = seriesImg ?? null;
          const imgUrl = modelImg ?? fallback;
          urls.push({
            loc: `${SITE_URL}/stroje/${brand.slug}/${s.slug}/${short}/`,
            changefreq: 'monthly',
            lastmod: STATIC_LASTMOD,
            images: imgUrl ? [imgUrl] : undefined,
          });
        }
      }
      for (const fam of families) {
        urls.push({ loc: `${SITE_URL}/stroje/${brand.slug}/rada/${catKey}/${fam}/`, changefreq: 'monthly', priority: '0.6', lastmod: STATIC_LASTMOD });
      }
    }
  }

  const [znacky, encyklopedie, puda] = await Promise.all([
    getCollection('znacky'),
    getCollection('encyklopedie'),
    getCollection('puda'),
  ]);

  for (const z of znacky) {
    const zUpdated = (z.data as any).aktualizovano as Date | undefined;
    urls.push({
      loc: `${SITE_URL}/znacky/${z.id}/`,
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: zUpdated ? zUpdated.toISOString().slice(0, 10) : STATIC_LASTMOD,
    });
  }
  for (const e of encyklopedie) {
    const heroImg = e.data.heroImage;
    urls.push({
      loc: `${SITE_URL}/encyklopedie/${e.id}/`,
      changefreq: 'monthly',
      lastmod: e.data.lastVerified ? e.data.lastVerified.toISOString().slice(0, 10) : STATIC_LASTMOD,
      images: heroImg ? [heroImg] : undefined,
    });
  }
  for (const p of puda) {
    urls.push({ loc: `${SITE_URL}/puda/${p.id}/`, changefreq: 'monthly', lastmod: STATIC_LASTMOD });
  }

  const howto = await getCollection('howto');
  for (const h of howto) {
    urls.push({
      loc: `${SITE_URL}/jak-na-to/${h.id}/`,
      changefreq: 'monthly',
      priority: '0.75',
      lastmod: (h.data.lastVerified ?? h.data.datePublished).toISOString().slice(0, 10),
      images: h.data.heroImage ? [h.data.heroImage] : undefined,
    });
  }

  const dotace = await getCollection('dotace');
  for (const dt of dotace) {
    urls.push({ loc: `${SITE_URL}/dotace/${dt.data.slug}/`, changefreq: 'monthly', priority: '0.8', lastmod: STATIC_LASTMOD });
  }

  for (const d of getAllDruhy()) {
    urls.push({ loc: `${SITE_URL}/plemena/${d.slug}/`, changefreq: 'monthly', lastmod: STATIC_LASTMOD });
    for (const p of d.plemena) {
      urls.push({ loc: `${SITE_URL}/plemena/${d.slug}/${p.slug}/`, changefreq: 'monthly', lastmod: STATIC_LASTMOD });
    }
  }

  for (const v of getAllVcely()) {
    urls.push({ loc: `${SITE_URL}/vcelarstvi/druhy/${v.slug}/`, changefreq: 'monthly', priority: '0.7', lastmod: STATIC_LASTMOD, images: v.image_url ? [v.image_url] : undefined });
  }
  for (const x of getAllVybaveni()) {
    urls.push({ loc: `${SITE_URL}/vcelarstvi/vybaveni/${x.slug}/`, changefreq: 'monthly', priority: '0.65', lastmod: STATIC_LASTMOD, images: x.image_url ? [x.image_url] : undefined });
  }
  for (const m of getAllMed()) {
    urls.push({ loc: `${SITE_URL}/vcelarstvi/med/${m.slug}/`, changefreq: 'monthly', priority: '0.65', lastmod: STATIC_LASTMOD, images: m.image_url ? [m.image_url] : undefined });
  }

  // Comparison pairs — match the limit used by /srovnani/[combo]/getStaticPaths
  // so every prerendered pair (including mid-class 90–195 hp tractors) is in
  // sitemap. Previously capped at 220 → Google saw only top-power flagships,
  // mid-class pairs were prerendered but not discoverable.
  for (const pair of expandedComparisonPairs(5000)) {
    urls.push({ loc: `${SITE_URL}/srovnani/${pair.combo}/`, changefreq: 'monthly', priority: '0.65', lastmod: STATIC_LASTMOD });
  }

  // Tier-list pages (top-10 lists per segment).
  urls.push({ loc: `${SITE_URL}/srovnani/top/`, changefreq: 'weekly', priority: '0.8', lastmod: STATIC_LASTMOD });
  for (const t of (await import('../lib/tier-lists')).TIER_LISTS) {
    urls.push({ loc: `${SITE_URL}/srovnani/top/${t.slug}/`, changefreq: 'weekly', priority: '0.75', lastmod: STATIC_LASTMOD });
  }

  for (const a of articlesDyn) {
    urls.push({
      loc: `${SITE_URL}/novinky/${a.slug}/`,
      lastmod: a.published_at || undefined,
      changefreq: 'weekly',
    });
  }

  for (const l of listingsDyn) {
    urls.push({
      loc: `${SITE_URL}/bazar/${l.id}/`,
      lastmod: (l as { updated_at?: string }).updated_at || (l as { created_at?: string }).created_at || undefined,
      changefreq: 'weekly',
    });
  }

  // Farmy — hub má vlastní záznam výše; zde detaily + krajské landingy.
  for (const f of getAllFarms()) {
    urls.push({
      loc: `${SITE_URL}/farmy/${f.slug}/`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: STATIC_LASTMOD,
      images: f.photos && f.photos.length > 0 ? [f.photos[0]] : undefined,
    });
  }
  for (const r of regionsWithEnoughFarms(3)) {
    urls.push({ loc: `${SITE_URL}/farmy/kraj/${r.slug}/`, changefreq: 'weekly', priority: '0.7', lastmod: STATIC_LASTMOD });
  }

  // SK launch (Fáze 1c-obsah): pre přeložené katalogové sekcie (/stroje, /znacky,
  // /srovnani) pridáme /sk zrkadlové URL. cs časť vyššie zostáva byte-identická —
  // /sk záznamy len appendujeme na koniec.
  //
  // Pozn.: /dotace DETAIL stránky majú pre sk INÉ slugy (PPA SR výzvy z kolekcie
  // 'dotaceSk'), takže ich nemožno len zrkadliť z cs slugov — tie /sk URL by 404-ovali.
  // Cestu cs /dotace/<slug>/ preto z mirroru vylúčime a sk detaily pridáme explicitne
  // nižšie z getCollection('dotaceSk'). Hub /dotace/ a /dotace/kalendar-kol/ zdieľajú
  // rovnaké cesty pre cs aj sk, tie sa mirrorujú normálne.
  const isDotaceDetailPath = (p: string) =>
    p.startsWith('/dotace/') && p !== '/dotace/' && p !== '/dotace/kalendar-kol/';
  const skMirror: UrlEntry[] = urls
    .filter((u) => {
      if (!u.loc.startsWith(SITE_URL)) return false;
      const p = u.loc.slice(SITE_URL.length);
      if (isDotaceDetailPath(p)) return false;
      // Lock přebíjí launch: zamčené pod-cesty (/kalkulacka/dotace-cap) nezrcadlit
      // do /sk sitemapy — na produkci 307-ují na cs.
      return isSkLaunchedPath(p) && !isLockedSectionPath(p);
    })
    .map((u) => ({ ...u, loc: `${SITE_URL}/sk${u.loc.slice(SITE_URL.length)}` }));
  urls.push(...skMirror);

  // SK /dotace detail URL — vlastné slugy z kolekcie 'dotaceSk' (PPA SR výzvy).
  const dotaceSkEntries = await getCollection('dotaceSk');
  for (const dt of dotaceSkEntries) {
    urls.push({ loc: `${SITE_URL}/sk/dotace/${dt.data.slug}/`, changefreq: 'monthly', priority: '0.8', lastmod: STATIC_LASTMOD });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(renderUrl).join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
