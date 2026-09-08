// Zařazení URL do dílčí sitemapy. Samostatný modul (bez astro:content a
// Supabase) — aby šel testovat a importovat i tam, kde se sitemapa nestaví.
import { SITE_URL } from './config';
// Sekce se odvozuje z URL, ne z místa v kódu výše — díky tomu nemusí ~200
// `urls.push()` volání nic vědět o sitemapách a nová stránka spadne do
// správného souboru sama.

export const SITEMAP_SECTIONS = [
  'stroje',
  'plodiny',
  'chov',
  'bazar',
  'novinky',
  'ostatni',
  'sk',
  'uk',
  'pl',
  'de',
] as const;

export type SitemapSection = (typeof SITEMAP_SECTIONS)[number];

// Jazykové mutace mají vlastní soubor každá. V Search Consoli je pak na první
// pohled vidět, jestli se nová jazyková verze indexuje, nebo leží ladem.
const LOCALE_SECTIONS = new Set<string>(['sk', 'uk', 'pl', 'de']);

// První segment cesty → sekce. Co tu není, padá do 'ostatni'.
const SEGMENT_SECTION: Record<string, SitemapSection> = {
  stroje: 'stroje',
  znacky: 'stroje',
  encyklopedie: 'stroje',
  srovnani: 'stroje',
  zebricky: 'stroje',
  historie: 'stroje',
  plodiny: 'plodiny',
  odrudy: 'plodiny',
  choroby: 'plodiny',
  puda: 'plodiny',
  plemena: 'chov',
  vcelarstvi: 'chov',
  'chov-hlemyzdu': 'chov',
  farmy: 'chov',
  bazar: 'bazar',
  prodejci: 'bazar',
  prodejce: 'bazar',
  novinky: 'novinky',
  akce: 'novinky',
};

export function sitemapSection(loc: string): SitemapSection {
  const path = loc.startsWith(SITE_URL) ? loc.slice(SITE_URL.length) : loc;
  const first = path.replace(/^\//, '').split('/')[0] ?? '';
  if (LOCALE_SECTIONS.has(first)) return first as SitemapSection;
  return SEGMENT_SECTION[first] ?? 'ostatni';
}

export function isSitemapSection(v: string | undefined): v is SitemapSection {
  return typeof v === 'string' && (SITEMAP_SECTIONS as readonly string[]).includes(v);
}

