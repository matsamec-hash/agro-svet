import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllBrands, getAllModels, seriesFamily, FUNCTIONAL_GROUPS } from '../lib/stroje';
import { getAllDruhy } from '../lib/plemena';
import { topComparisonPairs } from '../lib/comparator';
import { createAnonClient } from '../lib/supabase';
import { AGRO_SVET_SITE_ID as NOVINKY_SITE_ID, SITE_URL } from '../lib/config';

const NOVINKY_CATEGORIES = ['technika', 'dotace', 'trh', 'legislativa', 'znacky', 'novinky'];

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

  const staticPaths: Array<[string, UrlEntry['changefreq'], string?]> = [
    ['/', 'daily', '1.0'],
    ['/novinky/', 'daily', '0.9'],
    ['/bazar/', 'daily', '0.7'],
    ['/stroje/', 'weekly', '0.9'],
    ['/stroje/traktory/', 'weekly'],
    ['/stroje/kombajny/', 'weekly'],
    ['/stroje/zemedelske-stroje/', 'weekly', '0.85'],
    ['/znacky/', 'weekly', '0.8'],
    ['/encyklopedie/', 'weekly'],
    ['/plemena/', 'weekly'],
    ['/puda/', 'weekly'],
    ['/fotosoutez/', 'weekly', '0.8'],
    ['/fotosoutez/archiv/', 'monthly'],
    ['/fotosoutez/pravidla/', 'yearly'],
    ['/fotosoutez/gdpr/', 'yearly'],
    ['/statistiky/', 'weekly'],
    ['/srovnani/', 'weekly', '0.85'],
    ['/kalkulacka/', 'monthly', '0.8'],
    ['/kalkulacka/leasing-traktoru/', 'monthly', '0.75'],
    ['/kalkulacka/naklady-na-hektar/', 'monthly', '0.75'],
    ['/prodejci/', 'monthly', '0.8'],
    ['/dotace/', 'weekly', '0.85'],
    ['/dotace/kalendar-kol/', 'weekly', '0.75'],
    ['/jak-na-to/', 'weekly', '0.8'],
    ['/media/', 'monthly'],
    ['/redakce/', 'monthly', '0.5'],
  ];
  for (const [path, changefreq, priority] of staticPaths) {
    urls.push({ loc: `${SITE_URL}${path}`, changefreq, priority });
  }

  for (const cat of NOVINKY_CATEGORIES) {
    urls.push({ loc: `${SITE_URL}/novinky/kategorie/${cat}/`, changefreq: 'weekly' });
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
    urls.push({ loc: `${SITE_URL}/stroje/zemedelske-stroje/${groupSlug}/`, changefreq: 'weekly', priority: '0.75' });
  }

  // Stroje sub-kategorie (cross-brand pages /stroje/<subcategory>/) — pouze ty s modely.
  const subcategoriesWithModels = new Set(allStrojeModels.map((m) => m.effective_category));
  for (const subcat of subcategoriesWithModels) {
    urls.push({ loc: `${SITE_URL}/stroje/${subcat}/`, changefreq: 'weekly', priority: '0.7' });
  }

  for (const brand of getAllBrands()) {
    urls.push({ loc: `${SITE_URL}/stroje/${brand.slug}/`, changefreq: 'monthly', priority: '0.7' });
    for (const [catKey, cat] of Object.entries(brand.categories || {})) {
      const families = new Set<string>();
      for (const s of cat.series || []) {
        families.add(s.family || seriesFamily(s.slug));
        const seriesImg = s.image_url;
        urls.push({
          loc: `${SITE_URL}/stroje/${brand.slug}/${s.slug}/`,
          changefreq: 'monthly',
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
            images: imgUrl ? [imgUrl] : undefined,
          });
        }
      }
      for (const fam of families) {
        urls.push({ loc: `${SITE_URL}/stroje/${brand.slug}/rada/${catKey}/${fam}/`, changefreq: 'monthly', priority: '0.6' });
      }
    }
  }

  const [znacky, encyklopedie, puda] = await Promise.all([
    getCollection('znacky'),
    getCollection('encyklopedie'),
    getCollection('puda'),
  ]);

  for (const z of znacky) {
    urls.push({ loc: `${SITE_URL}/znacky/${z.id}/`, changefreq: 'monthly' });
  }
  for (const e of encyklopedie) {
    const heroImg = e.data.heroImage;
    urls.push({
      loc: `${SITE_URL}/encyklopedie/${e.id}/`,
      changefreq: 'monthly',
      lastmod: e.data.lastVerified ? e.data.lastVerified.toISOString().slice(0, 10) : undefined,
      images: heroImg ? [heroImg] : undefined,
    });
  }
  for (const p of puda) {
    urls.push({ loc: `${SITE_URL}/puda/${p.id}/`, changefreq: 'monthly' });
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
    urls.push({ loc: `${SITE_URL}/dotace/${dt.data.slug}/`, changefreq: 'monthly', priority: '0.8' });
  }

  for (const d of getAllDruhy()) {
    urls.push({ loc: `${SITE_URL}/plemena/${d.slug}/`, changefreq: 'monthly' });
    for (const p of d.plemena) {
      urls.push({ loc: `${SITE_URL}/plemena/${d.slug}/${p.slug}/`, changefreq: 'monthly' });
    }
  }

  // Comparison pairs — same list that generates /srovnani/[combo]/ routes.
  for (const pair of topComparisonPairs(220)) {
    urls.push({ loc: `${SITE_URL}/srovnani/${pair.combo}/`, changefreq: 'monthly', priority: '0.65' });
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
