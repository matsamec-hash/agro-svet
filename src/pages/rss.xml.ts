import type { APIRoute } from 'astro';
import { createAnonClient } from '../lib/supabase';
import { AGRO_SVET_SITE_ID as SITE_ID, SITE_URL } from '../lib/config';

const FEED_TITLE = 'agro-svět.cz — novinky';
const FEED_DESC =
  'Aktuální zpravodajství ze zemědělského sektoru — technika, dotace, trh, legislativa, značky.';
const FEED_LANG = 'cs-CZ';
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

const CATEGORY_LABELS: Record<string, string> = {
  technika: 'Technika',
  dotace: 'Dotace',
  trh: 'Trh',
  legislativa: 'Legislativa',
  znacky: 'Značky',
  novinky: 'Novinky',
};

export const GET: APIRoute = async () => {
  const supabase = createAnonClient();
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, title, perex, published_at, updated_at, category, featured_image_url')
    .eq('site_id', SITE_ID)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(ITEM_LIMIT);

  const buildDate = articles && articles.length > 0
    ? rfc822((articles[0] as { updated_at?: string; published_at: string }).updated_at ?? articles[0].published_at)
    : new Date().toUTCString();

  const items = (articles ?? []).map((a) => {
    const url = `${SITE_URL}/novinky/${a.slug}/`;
    const categoryLabel = CATEGORY_LABELS[a.category as string] ?? a.category;
    const imageEnclosure = (a as { featured_image_url?: string | null }).featured_image_url
      ? `\n      <enclosure url="${xmlEscape((a as { featured_image_url: string }).featured_image_url)}" type="image/jpeg" />`
      : '';
    return `    <item>
      <title>${xmlEscape(a.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${rfc822(a.published_at)}</pubDate>
      <category>${xmlEscape(categoryLabel)}</category>
      <description>${xmlEscape(a.perex ?? a.title)}</description>${imageEnclosure}
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(FEED_TITLE)}</title>
    <link>${SITE_URL}/novinky/</link>
    <description>${xmlEscape(FEED_DESC)}</description>
    <language>${FEED_LANG}</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
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
