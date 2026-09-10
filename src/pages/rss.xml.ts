import type { APIRoute } from 'astro';
import { createAnonClient } from '../lib/supabase';
import { AGRO_SVET_SITE_ID as SITE_ID, SITE_URL } from '../lib/config';
import { getLocaleFromUrl, localizePath, localizedCategory, bcp47, t } from '../i18n/utils';
import { HIDDEN_NEWS_CATEGORIES } from '../i18n/nav';
import { newsCategorySlug } from '../lib/news-category';
import {
  fetchArticleTranslations,
  fetchTranslatedArticleIds,
  buildTranslationMap,
  overlayArticle,
} from '../lib/articles-i18n';
import type { Locale } from '../i18n/config';

// ‼️ Feed byl do 2026-09-10 natvrdo ČESKÝ a přitom se servíruje pod všemi
// jazykovými prefixy (middleware přepíše /de/rss.xml na tuhle cs-root routu).
// Němec, Polák i Ukrajinec si tak do čtečky přidali české dotační zpravodajství
// — včetně kategorií `dotace` a `legislativa`, které jsou pro ne-cs locale
// SCHVÁLNĚ skryté, a s odkazy na české URL. Přesně ta třída chyby, kterou repo
// hlídá ve stránkách („český obsah pod cizojazyčnou hlavičkou"), jen ve
// strojově čitelném výstupu, kam se nikdo nedíval.
//
// Pravidla jsou teď stejná jako u /novinky výpisu:
//   • ne-cs bere JEN reálně přeložené články (article_translations),
//   • jurisdikčně skryté kategorie vypadnou (HIDDEN_NEWS_CATEGORIES),
//   • odkazy míří pod prefix daného jazyka,
//   • titulek, popis i <language> jsou v daném jazyce.
// Když překlady nejsou, feed je PRÁZDNÝ — to je správně. Prázdný feed čtenáře
// neoklame, český feed pod německou adresou ano.

const ITEM_LIMIT = 50;

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

function rfc822(iso: string): string {
  return new Date(iso).toUTCString();
}

export const GET: APIRoute = async ({ locals, url }) => {
  const locale = ((locals as { locale?: Locale }).locale ?? getLocaleFromUrl(url)) as Locale;
  const supabase = createAnonClient();

  // ‼️ Nejdřív zjisti, jestli pro tenhle jazyk vůbec nějaké překlady jsou.
  // Prázdná množina musí vést k prázdnému feedu, NE k dotazu bez filtru —
  // to by byl přesně ten český leak, kvůli kterému se tohle přepisovalo.
  const translatedIds = locale === 'cs' ? null : await fetchTranslatedArticleIds(supabase, locale);
  const hidden = locale === 'cs' ? [] : HIDDEN_NEWS_CATEGORIES[locale];

  let rows: any[] = [];
  if (!translatedIds || translatedIds.size > 0) {
    // POZOR: neselektovat `updated_at` — sloupec v tabulce `articles` neexistuje a
    // PostgREST na neznámý sloupec vrací chybu → data=null → feed 0 položek (index
    // i news-sitemap ho proto neselektují). buildDate stavíme z published_at.
    let q = supabase
      .from('articles')
      .select('id, slug, title, perex, published_at, category, featured_image_url')
      .eq('site_id', SITE_ID)
      .eq('status', 'published');
    if (translatedIds) q = q.in('id', [...translatedIds]);
    if (hidden.length) q = q.not('category', 'in', `(${hidden.join(',')})`);
    const { data, error } = await q.order('published_at', { ascending: false }).limit(ITEM_LIMIT);
    if (error) console.error('rss articles query error', error);
    rows = data ?? [];

    // Overlay přeložených titulků a perexů na cs řádky.
    if (locale !== 'cs' && rows.length) {
      const trMap = buildTranslationMap(await fetchArticleTranslations(supabase, rows.map((a) => a.id), locale));
      rows = rows.map((a) => overlayArticle(a, trMap.get(a.id)));
    }
  }

  const buildDate = rows.length > 0 ? rfc822(rows[0].published_at) : new Date().toUTCString();

  const items = rows.map((a) => {
    const url = `${SITE_URL}${localizePath(locale, `/novinky/${a.slug}/`)}`;
    const catSlug = newsCategorySlug(a.category as string);
    const categoryLabel = catSlug ? localizedCategory(locale, catSlug) : '';
    const imageEnclosure = a.featured_image_url
      ? `\n      <enclosure url="${xmlEscape(a.featured_image_url)}" type="image/jpeg" />`
      : '';
    const category = categoryLabel ? `\n      <category>${xmlEscape(categoryLabel)}</category>` : '';
    return `    <item>
      <title>${xmlEscape(a.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${rfc822(a.published_at)}</pubDate>${category}
      <description>${xmlEscape(a.perex ?? a.title)}</description>${imageEnclosure}
    </item>`;
  });

  const selfHref = `${SITE_URL}${localizePath(locale, '/rss.xml')}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(t(locale, 'rss.title'))}</title>
    <link>${SITE_URL}${localizePath(locale, '/novinky/')}</link>
    <description>${xmlEscape(t(locale, 'rss.desc'))}</description>
    <language>${bcp47(locale)}</language>
    <atom:link href="${selfHref}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${buildDate}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  });
};
