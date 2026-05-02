import type { APIRoute } from 'astro';
import { createAnonClient } from '../lib/supabase';
import { AGRO_SVET_SITE_ID as SITE_ID, SITE_URL } from '../lib/config';

const PUBLICATION_NAME = 'agro-svět.cz';
const PUBLICATION_LANG = 'cs';
const FRESHNESS_HOURS = 48;

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
  const cutoff = new Date(Date.now() - FRESHNESS_HOURS * 60 * 60 * 1000).toISOString();

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, title, published_at, category, tags, featured_image_url')
    .eq('site_id', SITE_ID)
    .eq('status', 'published')
    .gte('published_at', cutoff)
    .order('published_at', { ascending: false })
    .limit(1000);

  const items = (articles ?? []).map((a) => {
    const url = `${SITE_URL}/novinky/${a.slug}/`;
    const keywords = (a.tags as string[] | null)?.length ? (a.tags as string[]).join(', ') : undefined;
    const imageUrl = (a as { featured_image_url?: string | null }).featured_image_url;
    return `  <url>
    <loc>${xmlEscape(url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(PUBLICATION_NAME)}</news:name>
        <news:language>${PUBLICATION_LANG}</news:language>
      </news:publication>
      <news:publication_date>${a.published_at}</news:publication_date>
      <news:title>${xmlEscape(a.title)}</news:title>
${keywords ? `      <news:keywords>${xmlEscape(keywords)}</news:keywords>\n` : ''}    </news:news>${imageUrl ? `
    <image:image>
      <image:loc>${xmlEscape(imageUrl)}</image:loc>
      <image:title>${xmlEscape(a.title)}</image:title>
    </image:image>` : ''}
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${items.join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // News sitemap should be fresh — short cache
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  });
};
