import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllBrands, getAllModels, seriesFamily, FUNCTIONAL_GROUPS } from '../lib/stroje';
import { getAllDruhy } from '../lib/plemena';
import { getAllFarms, regionsWithEnoughFarms } from '../lib/farmy';
import { getAllVcely, getAllVybaveni, getAllMed } from '../lib/vcelarstvi';
import { getAllHlemyzdi } from '../lib/hlemyzdi';
import { listPlodiny, listIndexableOdrudy, listSkupiny, listIndexableUdrzovatele } from '../lib/plodiny';
import { listIndexableChoroby } from '../lib/choroby';
import { expandedComparisonPairs, implementComparisonPairs } from '../lib/comparator';
import { createAnonClient } from '../lib/supabase';
import { listPublishedForMaintenance } from '../lib/akce-supabase';
import { AKCE_TYP_SLUGS } from '../lib/akce-constants';
import { getKraje } from '../lib/lokality';
import { AGRO_SVET_SITE_ID as NOVINKY_SITE_ID, SITE_URL } from '../lib/config';
import { isSkLaunchedPath, isLaunchedPath } from '../i18n/utils';
import { isLockedSectionPath, HIDDEN_NEWS_CATEGORIES } from '../i18n/nav';
import { dsDate, FALLBACK_LASTMOD } from '../lib/content-dates';
import svetIndex from '../data/svet/index.json';

const NOVINKY_CATEGORIES = ['technika', 'dotace', 'trh', 'legislativa', 'znacky', 'novinky'];

// Per-dataset content dates, baked at build time from git history
// (scripts/gen-content-dates.mjs). A URL's <lastmod> reflects when its CONTENT
// last changed, not when the site was deployed — so Google can trust it as a
// recrawl signal instead of seeing every URL "changed today" on every deploy.
const D_STROJE = dsDate('stroje'); // /stroje, /srovnani, /zebricky, /znacky hub
const D_PLEMENA = dsDate('plemena');
const D_PLODINY = dsDate('plodiny');
const D_CHOROBY = dsDate('choroby');
const D_VCELARSTVI = dsDate('vcelarstvi');
const D_HLEMYZDI = dsDate('hlemyzdi');
const D_FARMY = dsDate('farmy');
const D_SLOVNIK = dsDate('slovnik');
const D_KRAJE = dsDate('kraje');
const D_ENCYKLOPEDIE = dsDate('encyklopedie');
const D_ZNACKY = dsDate('znacky');
const D_DOTACE = dsDate('dotace');
const D_DOTACE_SK = dsDate('dotaceSk');
const D_PUDA = dsDate('puda');
const D_HOWTO = dsDate('howto');
const D_SVET = dsDate('svet'); // /svet, /svet/srovnani, country profiles (cs-only)

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
  // Stable fallback for genuinely static pages (legal, calculators, quizzes) that
  // have no underlying dataset. Baked from the HEAD commit date at build time — NOT
  // `new Date()`. The old per-request date re-stamped all ~23k URLs with "today" on
  // every request, which trains Google to ignore lastmod entirely. Dataset-backed
  // URLs use their own D_* date below.
  const STATIC_LASTMOD = FALLBACK_LASTMOD;

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
    .select('id, updated_at, created_at, category, brand')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(2000);
  if (listingsRes.error) console.error('sitemap bazar query error', listingsRes.error);
  const listingsDyn = listingsRes.data ?? [];

  // Zveřejněné akce (cs-only kalendář) — detail + landing URL níže.
  let akceDyn: Awaited<ReturnType<typeof listPublishedForMaintenance>> = [];
  try {
    akceDyn = await listPublishedForMaintenance();
  } catch (e) {
    console.error('sitemap akce query error', e);
  }

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
    ['/stroje/', 'weekly', '0.9', D_STROJE],
    ['/farmy/', 'weekly', '0.8', D_FARMY],
    ['/stroje/traktory/', 'weekly', undefined, D_STROJE],
    ['/stroje/kombajny/', 'weekly', undefined, D_STROJE],
    ['/stroje/zemedelske-stroje/', 'weekly', '0.85', D_STROJE],
    ['/znacky/', 'weekly', '0.8', D_ZNACKY],
    ['/encyklopedie/', 'weekly', undefined, D_ENCYKLOPEDIE],
    ['/plemena/', 'weekly', undefined, D_PLEMENA],
    ['/vcelarstvi/', 'weekly', '0.85', D_VCELARSTVI],
    ['/vcelarstvi/druhy/', 'weekly', '0.8', D_VCELARSTVI],
    ['/vcelarstvi/vybaveni/', 'weekly', '0.8', D_VCELARSTVI],
    ['/vcelarstvi/med/', 'weekly', '0.8', D_VCELARSTVI],
    ['/chov-hlemyzdu/', 'weekly', '0.85', D_HLEMYZDI],
    ['/kviz/jaka-vcela-pro-vas/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/puda/', 'weekly', undefined, D_PUDA],
    ['/fotosoutez/', 'weekly', '0.8', STATIC_LASTMOD],
    ['/fotosoutez/archiv/', 'monthly', undefined, STATIC_LASTMOD],
    ['/fotosoutez/pravidla/', 'yearly', undefined, STATIC_LASTMOD],
    ['/fotosoutez/gdpr/', 'yearly', undefined, STATIC_LASTMOD],
    ['/statistiky/', 'weekly', undefined, STATIC_LASTMOD],
    ['/svet/', 'weekly', '0.85', D_SVET],
    ['/svet/srovnani/', 'monthly', '0.6', D_SVET],
    ['/srovnani/', 'weekly', '0.85', D_STROJE],
    ['/zebricky/', 'weekly', '0.8', D_STROJE],
    ['/slovnik/', 'monthly', '0.75', D_SLOVNIK],
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
    ['/kolik-stoji/', 'monthly', '0.8', STATIC_LASTMOD],
    // topic slugy inline (ne import data modulu — držel by ho v SSR worker bundlu,
    // který je těsně pod 3 MiB CF limitem). Zdroj pravdy: src/data/kolik-stoji.ts.
    ['/kolik-stoji/traktor/', 'monthly', '0.75', STATIC_LASTMOD],
    ['/kolik-stoji/kombajn/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/kolik-stoji/provoz-traktoru-na-hektar/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/kolik-stoji/leasing-traktoru/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/kolik-stoji/nafta-na-hektar/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/prodejci/', 'monthly', '0.8', STATIC_LASTMOD],
    ['/dotace/', 'weekly', '0.85', D_DOTACE],
    ['/dotace/kalendar-kol/', 'weekly', '0.75', D_DOTACE],
    ['/dotace/jak-vybrat/', 'monthly', '0.8', D_DOTACE],
    ['/jak-na-to/', 'weekly', '0.8', D_HOWTO],
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
    ['/sezona/', 'monthly', '0.75', STATIC_LASTMOD],
    ['/sezona/jaro/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/sezona/leto/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/sezona/podzim/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/sezona/zima/', 'monthly', '0.7', STATIC_LASTMOD],
    ['/sezona/kalendar/', 'monthly', '0.75', STATIC_LASTMOD],
  ];
  for (const [path, changefreq, priority, lastmod] of staticPaths) {
    urls.push({ loc: `${SITE_URL}${path}`, changefreq, priority, lastmod });
  }

  // /svet country profiles (cs-only; reference country = the comparison baseline,
  // it has no standalone profile page so skip it).
  for (const c of svetIndex.countries.filter((c) => !c.reference)) {
    urls.push({ loc: `${SITE_URL}/svet/${c.slug}/`, changefreq: 'monthly', priority: '0.7', lastmod: D_SVET });
  }

  for (const cat of NOVINKY_CATEGORIES) {
    urls.push({ loc: `${SITE_URL}/novinky/kategorie/${cat}/`, changefreq: 'weekly', lastmod: latestArticleLastmod ?? STATIC_LASTMOD });
  }

  // Sekce „Chov hlemýžďů" — 16 podstránek (statická data v src/lib/hlemyzdi.ts).
  for (const a of getAllHlemyzdi()) {
    urls.push({
      loc: `${SITE_URL}/chov-hlemyzdu/${a.slug}/`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: D_HLEMYZDI,
      images: a.featured_image_url ? [a.featured_image_url] : undefined,
    });
  }

  // Žebříčky — top-N seznamy generované z stroje dat.
  const { TIER_LISTS } = await import('../lib/tier-lists');
  for (const t of TIER_LISTS) {
    urls.push({ loc: `${SITE_URL}/zebricky/${t.slug}/`, changefreq: 'weekly', priority: '0.75', lastmod: D_STROJE });
  }

  // Slovník zemědělských pojmů.
  const { SLOVNIK } = await import('../lib/slovnik');
  for (const term of SLOVNIK) {
    urls.push({ loc: `${SITE_URL}/slovnik/${term.slug}/`, changefreq: 'monthly', priority: '0.6', lastmod: D_SLOVNIK });
  }

  // Kraj-level lokální bazar landing pages.
  const { KRAJE } = await import('../lib/cap-dotace');
  for (const k of KRAJE) {
    urls.push({ loc: `${SITE_URL}/bazar/kraj/${k.slug}/`, changefreq: 'weekly', priority: '0.65', lastmod: latestListingLastmod ?? D_KRAJE });
  }

  // Category landing pages (/bazar/kategorie/<cat>/) — all categories, they are
  // legitimate top-level targets ("bazar traktorů"). Category × brand pages are
  // added ONLY for combos that actually have active listings (empty combos are
  // served noindex, so they must not appear in the sitemap).
  const { CATEGORIES: BAZAR_CATEGORIES, BRANDS: BAZAR_BRANDS } = await import('../lib/bazar-constants');
  const validCat = new Set(BAZAR_CATEGORIES.map((c) => c.value));
  const validBrand = new Set(BAZAR_BRANDS.map((b) => b.value));
  for (const c of BAZAR_CATEGORIES) {
    urls.push({ loc: `${SITE_URL}/bazar/kategorie/${c.value}/`, changefreq: 'weekly', priority: '0.7', lastmod: latestListingLastmod ?? D_KRAJE });
  }
  const catBrandCombos = new Set<string>();
  for (const l of listingsDyn as Array<{ category?: string; brand?: string }>) {
    if (l.category && l.brand && validCat.has(l.category) && validBrand.has(l.brand)) {
      catBrandCombos.add(`${l.category}/${l.brand}`);
    }
  }
  for (const combo of catBrandCombos) {
    urls.push({ loc: `${SITE_URL}/bazar/kategorie/${combo}/`, changefreq: 'weekly', priority: '0.6', lastmod: latestListingLastmod ?? D_KRAJE });
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
    urls.push({ loc: `${SITE_URL}/stroje/zemedelske-stroje/${groupSlug}/`, changefreq: 'weekly', priority: '0.75', lastmod: D_STROJE });
  }

  // Stroje sub-kategorie (cross-brand pages /stroje/<subcategory>/) — pouze ty s modely
  // a které jsou v FUNCTIONAL_GROUPS.categories (jen ty mají route v [subcategory]/index.astro).
  const routableSubcats = new Set(Object.values(FUNCTIONAL_GROUPS).flatMap((g) => g.categories as readonly string[]));
  const subcategoriesWithModels = new Set(allStrojeModels.map((m) => m.effective_category));
  for (const subcat of subcategoriesWithModels) {
    if (!routableSubcats.has(subcat)) continue;
    urls.push({ loc: `${SITE_URL}/stroje/${subcat}/`, changefreq: 'weekly', priority: '0.7', lastmod: D_STROJE });
  }

  for (const brand of getAllBrands()) {
    urls.push({ loc: `${SITE_URL}/stroje/${brand.slug}/`, changefreq: 'monthly', priority: '0.7', lastmod: D_STROJE });
    for (const [catKey, cat] of Object.entries(brand.categories || {})) {
      const families = new Set<string>();
      for (const s of cat.series || []) {
        families.add(s.family || seriesFamily(s.slug));
        const seriesImg = s.image_url;
        urls.push({
          loc: `${SITE_URL}/stroje/${brand.slug}/${s.slug}/`,
          changefreq: 'monthly',
          lastmod: D_STROJE,
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
            lastmod: D_STROJE,
            images: imgUrl ? [imgUrl] : undefined,
          });
        }
      }
      for (const fam of families) {
        urls.push({ loc: `${SITE_URL}/stroje/${brand.slug}/rada/${catKey}/${fam}/`, changefreq: 'monthly', priority: '0.6', lastmod: D_STROJE });
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
      lastmod: zUpdated ? zUpdated.toISOString().slice(0, 10) : D_ZNACKY,
    });
  }
  for (const e of encyklopedie) {
    const heroImg = e.data.heroImage;
    urls.push({
      loc: `${SITE_URL}/encyklopedie/${e.id}/`,
      changefreq: 'monthly',
      lastmod: e.data.lastVerified ? e.data.lastVerified.toISOString().slice(0, 10) : D_ENCYKLOPEDIE,
      images: heroImg ? [heroImg] : undefined,
    });
  }
  for (const p of puda) {
    urls.push({ loc: `${SITE_URL}/puda/${p.id}/`, changefreq: 'monthly', lastmod: D_PUDA });
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
    urls.push({ loc: `${SITE_URL}/dotace/${dt.data.slug}/`, changefreq: 'monthly', priority: '0.8', lastmod: D_DOTACE });
  }

  for (const d of getAllDruhy()) {
    urls.push({ loc: `${SITE_URL}/plemena/${d.slug}/`, changefreq: 'monthly', lastmod: D_PLEMENA });
    for (const p of d.plemena) {
      urls.push({ loc: `${SITE_URL}/plemena/${d.slug}/${p.slug}/`, changefreq: 'monthly', lastmod: D_PLEMENA });
    }
  }

  // Plodiny + indexovatelné odrůdy + facety (anti-thin: jen indexovatelné)
  urls.push({ loc: `${SITE_URL}/plodiny/`, changefreq: 'weekly', lastmod: D_PLODINY });
  for (const p of listPlodiny()) {
    urls.push({ loc: `${SITE_URL}/plodiny/${p.slug}/`, changefreq: 'monthly', lastmod: D_PLODINY });
  }
  for (const e of listIndexableOdrudy()) {
    urls.push({ loc: `${SITE_URL}/plodiny/${e.plodina_slug}/${e.odruda.slug}/`, changefreq: 'monthly', lastmod: D_PLODINY });
  }
  for (const s of listSkupiny()) {
    urls.push({ loc: `${SITE_URL}/plodiny/skupina/${s.skupina}/`, changefreq: 'monthly', lastmod: D_PLODINY });
  }
  for (const u of listIndexableUdrzovatele()) {
    urls.push({ loc: `${SITE_URL}/odrudy/udrzovatel/${u.slug}/`, changefreq: 'monthly', lastmod: D_PLODINY });
  }

  // Choroby a škůdci — hub + detaily (anti-thin: jen choroby s popisem a ≥1 plodinou)
  urls.push({ loc: `${SITE_URL}/choroby/`, changefreq: 'weekly', lastmod: D_CHOROBY });
  for (const c of listIndexableChoroby()) {
    urls.push({ loc: `${SITE_URL}/choroby/${c.slug}/`, changefreq: 'monthly', lastmod: D_CHOROBY });
  }

  for (const v of getAllVcely()) {
    urls.push({ loc: `${SITE_URL}/vcelarstvi/druhy/${v.slug}/`, changefreq: 'monthly', priority: '0.7', lastmod: D_VCELARSTVI, images: v.image_url ? [v.image_url] : undefined });
  }
  for (const x of getAllVybaveni()) {
    urls.push({ loc: `${SITE_URL}/vcelarstvi/vybaveni/${x.slug}/`, changefreq: 'monthly', priority: '0.65', lastmod: D_VCELARSTVI, images: x.image_url ? [x.image_url] : undefined });
  }
  for (const m of getAllMed()) {
    urls.push({ loc: `${SITE_URL}/vcelarstvi/med/${m.slug}/`, changefreq: 'monthly', priority: '0.65', lastmod: D_VCELARSTVI, images: m.image_url ? [m.image_url] : undefined });
  }

  // Comparison pairs — match the limit used by /srovnani/[combo]/getStaticPaths
  // so every prerendered pair (including mid-class 90–195 hp tractors) is in
  // sitemap. Previously capped at 220 → Google saw only top-power flagships,
  // mid-class pairs were prerendered but not discoverable.
  for (const pair of expandedComparisonPairs(5000)) {
    urls.push({ loc: `${SITE_URL}/srovnani/${pair.combo}/`, changefreq: 'monthly', priority: '0.65', lastmod: D_STROJE });
  }

  // Implement (nářadí) páry — párované dle záběru, match limit z [combo]/getStaticPaths.
  for (const pair of implementComparisonPairs(4000)) {
    urls.push({ loc: `${SITE_URL}/srovnani/${pair.combo}/`, changefreq: 'monthly', priority: '0.6', lastmod: D_STROJE });
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
      lastmod: D_FARMY,
      images: f.photos && f.photos.length > 0 ? [f.photos[0]] : undefined,
    });
  }
  for (const r of regionsWithEnoughFarms(3)) {
    urls.push({ loc: `${SITE_URL}/farmy/kraj/${r.slug}/`, changefreq: 'weekly', priority: '0.7', lastmod: D_FARMY });
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
  // /sk-skryté novinkové kategorie (jurisdikčně uzamčené: dotace, legislativa)
  // pod /sk 404-ují → nezrcadlit do /sk sitemapy.
  const skHiddenCatMatch = /^\/novinky\/kategorie\/([^/]+)\//;
  const isSkHiddenCategoryPath = (p: string) => {
    const m = p.match(skHiddenCatMatch);
    return !!m && HIDDEN_NEWS_CATEGORIES.sk.includes(m[1]);
  };
  const skMirror: UrlEntry[] = urls
    .filter((u) => {
      if (!u.loc.startsWith(SITE_URL)) return false;
      const p = u.loc.slice(SITE_URL.length);
      if (isDotaceDetailPath(p)) return false;
      if (isSkHiddenCategoryPath(p)) return false;
      // Lock přebíjí launch: zamčené pod-cesty (/kalkulacka/dotace-cap) nezrcadlit
      // do /sk sitemapy — na produkci 307-ují na cs.
      return isSkLaunchedPath(p) && !isLockedSectionPath(p);
    })
    .map((u) => ({ ...u, loc: `${SITE_URL}/sk${u.loc.slice(SITE_URL.length)}` }));
  urls.push(...skMirror);

  // UK launch (Fáze 2-obsah): pro přeložené sekce přidáme /uk zrcadlové URL.
  // Stejné filtry jako sk (skryté dotace-detaily/kategorie + lock). Před launchem
  // je LAUNCHED_PREFIXES.uk prázdné → ukMirror == [] (žádná změna sitemapy).
  // Fáze 3: howto-uk je PODMNOŽINA cs howto (2 jurisdikční návody nepřeloženy →
  // /uk/jak-na-to/<slug>/ = 404). Nezrcadlit cs howto slugy chybějící v howtoUk.
  const ukHowtoSlugs = new Set((await getCollection('howtoUk')).map((h) => h.id));
  const isUkMissingHowto = (p: string): boolean => {
    const m = p.match(/^\/jak-na-to\/([^/]+)\/$/);
    return !!m && !ukHowtoSlugs.has(m[1]);
  };
  const ukMirror: UrlEntry[] = urls
    .filter((u) => {
      if (!u.loc.startsWith(SITE_URL)) return false;
      const p = u.loc.slice(SITE_URL.length);
      if (p.startsWith('/sk/')) return false; // nezrcadlit už zrcadlené sk URL
      if (isDotaceDetailPath(p)) return false;
      if (p === '/dotace/kalendar-kol/') return false; // uk: kalendar-kol 302→/uk/dotace/, nezrcadlit
      if (isSkHiddenCategoryPath(p)) return false;
      if (isUkMissingHowto(p)) return false; // chybějící uk návod → 404, nezrcadlit
      return isLaunchedPath('uk', p) && !isLockedSectionPath(p);
    })
    .map((u) => ({ ...u, loc: `${SITE_URL}/uk${u.loc.slice(SITE_URL.length)}` }));
  urls.push(...ukMirror);

  // PL launch (Fáze 1): zrcadli launchnuté sekce (stroje/znacky/srovnani/slovnik).
  // Žádné per-locale slug-divergence (na rozdíl od sk/uk dotace/howto) → prostý
  // filtr na launchnuté & nelocked, vyloučit už zrcadlené /sk/ a /uk/ URL.
  const plMirror: UrlEntry[] = urls
    .filter((u) => {
      if (!u.loc.startsWith(SITE_URL)) return false;
      const p = u.loc.slice(SITE_URL.length);
      if (p.startsWith('/sk/') || p.startsWith('/uk/')) return false; // nezrcadlit už zrcadlené
      return isLaunchedPath('pl', p) && !isLockedSectionPath(p);
    })
    .map((u) => ({ ...u, loc: `${SITE_URL}/pl${u.loc.slice(SITE_URL.length)}` }));
  urls.push(...plMirror);

  // SK /dotace detail URL — vlastné slugy z kolekcie 'dotaceSk' (PPA SR výzvy).
  const dotaceSkEntries = await getCollection('dotaceSk');
  for (const dt of dotaceSkEntries) {
    urls.push({ loc: `${SITE_URL}/sk/dotace/${dt.data.slug}/`, changefreq: 'monthly', priority: '0.8', lastmod: D_DOTACE_SK });
  }

  // Akce — hub vždy; detaily všechny zveřejněné; typ/kraj/kombinace jen když mají
  // ≥ prahu nadcházejících akcí (shodné s noindex prahem na landing → sitemap
  // nelistuje tenké/noindex stránky). cs-only, přidáno za mirrory → nezrcadlí se.
  const AKCE_INDEX_MIN = 3;
  const akceUpByTyp = new Map<string, number>();
  const akceUpByKraj = new Map<string, number>();
  const akceUpByCombo = new Map<string, number>();
  for (const a of akceDyn) {
    urls.push({
      loc: `${SITE_URL}/akce/${a.slug}/`,
      changefreq: 'weekly',
      priority: '0.55',
      lastmod: (a as { updated_at?: string }).updated_at?.slice(0, 10) ?? STATIC_LASTMOD,
    });
    if (!a.pristi_vyskyt) continue;
    akceUpByTyp.set(a.typ, (akceUpByTyp.get(a.typ) ?? 0) + 1);
    akceUpByKraj.set(a.kraj_slug, (akceUpByKraj.get(a.kraj_slug) ?? 0) + 1);
    const combo = `${a.typ}/${a.kraj_slug}`;
    akceUpByCombo.set(combo, (akceUpByCombo.get(combo) ?? 0) + 1);
  }
  urls.push({ loc: `${SITE_URL}/akce/`, changefreq: 'daily', priority: '0.7', lastmod: STATIC_LASTMOD });
  // Typové stránky = evergreen kategorie (vlastní úvod) → vždy indexovatelné.
  for (const typ of AKCE_TYP_SLUGS) {
    urls.push({ loc: `${SITE_URL}/akce/typ/${typ}/`, changefreq: 'weekly', priority: '0.65', lastmod: STATIC_LASTMOD });
  }
  // Krajské stránky do sitemapy jen když mají ≥1 nadcházející akci (jinak noindex).
  for (const k of getKraje()) {
    if ((akceUpByKraj.get(k.slug) ?? 0) >= 1) {
      urls.push({ loc: `${SITE_URL}/akce/kraj/${k.slug}/`, changefreq: 'weekly', priority: '0.6', lastmod: STATIC_LASTMOD });
    }
  }
  for (const [combo, n] of akceUpByCombo) {
    if (n >= AKCE_INDEX_MIN) {
      urls.push({ loc: `${SITE_URL}/akce/typ/${combo}/`, changefreq: 'weekly', priority: '0.5', lastmod: STATIC_LASTMOD });
    }
  }

  // Historie českého zemědělství — cs-only sekce (non-cs noindex+noHreflang).
  // Přidáno ZA mirrory → nezrcadlí se do sk/uk/pl. SSR (prerender:false), proto
  // se do sitemapy musí přidat explicitně (Astro je sám neenumeruje).
  const { machines: histMachines, milestones: histMilestones } = await import('../lib/historie');
  const histHubs: Array<[string, string]> = [
    ['/historie/', '0.75'],
    ['/historie/technika/', '0.7'],
    ['/historie/data/', '0.65'],
    ['/historie/dobovy-tisk/', '0.65'],
    ['/historie/zajimavosti/', '0.6'],
  ];
  for (const [path, priority] of histHubs) {
    urls.push({ loc: `${SITE_URL}${path}`, changefreq: 'monthly', priority, lastmod: STATIC_LASTMOD });
  }
  for (const m of histMachines) {
    urls.push({
      loc: `${SITE_URL}/historie/technika/${m.slug}/`,
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: STATIC_LASTMOD,
      images: m.image ? [m.image] : undefined,
    });
  }
  for (const m of histMilestones) {
    if (!m.slug) continue;
    urls.push({ loc: `${SITE_URL}/historie/milnik/${m.slug}/`, changefreq: 'monthly', priority: '0.55', lastmod: STATIC_LASTMOD });
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
