import type { APIRoute } from 'astro';
import { createAnonClient } from '../lib/supabase';
import { AGRO_SVET_SITE_ID as SITE_ID } from '../lib/config';
import { buildSeznamFeed, SEZNAM_COLUMNS, SEZNAM_QUERY_LIMIT } from '../lib/seznam-feed';
import { getLocaleFromUrl } from '../i18n/utils';
import type { Locale } from '../i18n/config';

// Jen česky: middleware sem přepisuje i /sk/rss-seznam.xml a Newsfeed je český.
export const GET: APIRoute = async ({ locals, url }) => {
  const locale = ((locals as { locale?: Locale }).locale ?? getLocaleFromUrl(url)) as Locale;
  if (locale !== 'cs') return new Response('Not Found', { status: 404 });

  const { data, error } = await createAnonClient()
    .from('articles')
    .select(SEZNAM_COLUMNS)
    .eq('site_id', SITE_ID)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(SEZNAM_QUERY_LIMIT);

  // Prázdný feed by Seznam vzal za platný, tak ať raději vidí chybu.
  if (error) {
    console.error('rss-seznam articles query error', error);
    return new Response('Service Unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  return new Response(buildSeznamFeed(data ?? []), {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  });
};
