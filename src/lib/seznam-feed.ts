// Feed pro Seznam Newsfeed (/rss-seznam.xml), vyvojari.seznam.cz/newsfeed/dokumentace/rss.
// Je zvlášť od /rss.xml, protože Seznam chce nejvýš 20 položek, JPG/PNG místo našich
// webp, titulek do 60 znaků a perex z celých vět. Čtečkám by tohle jen ubíralo.
// Všechna pravidla délek jsou doporučení: Seznam delší text zkrátí sám, jenže kdekoli.
// Proto se tady krátí jen na hranici věty, a když žádná vhodná není, text zůstane celý.
import { SITE_URL } from './config';
import { newsCategorySlug } from './news-category';
import { creditFor, creditFromArticle, ZASTUPNY, type PhotoCredit } from './photo-credit';
import { bcp47, localizedCategory, t } from '../i18n/utils';

const ITEM_LIMIT = 20;
const TITLE_MAX = 60;
// Kratší zbytek po zkrácení už z titulku nic nenechá.
const TITLE_MIN = 30;
const DESCRIPTION_MAX = 200;

// Pár článků navíc pro případ, že některý nemá jedinou větu a do feedu nesmí.
export const SEZNAM_QUERY_LIMIT = ITEM_LIMIT + 10;
export const SEZNAM_COLUMNS =
  'slug, title, seo_title, perex, seo_description, published_at, category, featured_image_url, featured_image_credit';

export interface SeznamArticle {
  slug: string;
  title: string;
  seo_title?: string | null;
  perex?: string | null;
  seo_description?: string | null;
  published_at: string;
  category?: string | null;
  featured_image_url?: string | null;
  featured_image_credit?: unknown;
}

// Emotikony, šipky a geometrické symboly („speciální grafické znaky“ podle Seznamu).
const GRAPHIC_CHARS = /[\p{Extended_Pictographic}←-⇿■-◿⟰-⟿⤀-⥿⬀-⯿️‍]/gu;

export function cleanFeedText(s: string | null | undefined): string {
  return (s ?? '').replace(/<[^>]*>/g, ' ').replace(GRAPHIC_CHARS, ' ').replace(/\s+/g, ' ').trim();
}

// Věta za čárkou, bez které by první půlka titulku tvrdila něco jiného.
// ‼️ Žádné \b: v JS zná jen ASCII, takže „když“ a „že“ by nikdy nesedlo.
const DEPENDENT_WORDS = 'ale|avšak|však|jenže|leč|pokud|když|jestli|jestliže|protože|neboť|že|aby|kdyby|ačkoli|přestože|i když|zatímco|nebo|dokud|než|kromě';
const HAS_DEPENDENT = new RegExp(`(?:^|[,;]\\s|\\s[–—]\\s)(?:${DEPENDENT_WORDS})(?=\\s|$)`, 'iu');

function fitsTitle(s: string): boolean {
  return s.length >= TITLE_MIN && s.length <= TITLE_MAX;
}

function cutHeadline(title: string): string | null {
  const withoutBrackets = title.replace(/\s*\([^()]*\)$/, '');
  if (withoutBrackets !== title && fitsTitle(withoutBrackets)) return withoutBrackets;

  // Nejdelší možný začátek. Desetinná čárka (21,48) za sebou mezeru nemá.
  const clauses = [...title.matchAll(/[,;]\s|\s[–—]\s/g)].reverse();
  for (const m of clauses) {
    const head = title.slice(0, m.index);
    if (fitsTitle(head)) return HAS_DEPENDENT.test(title.slice(m.index + m[0].length)) ? null : head;
  }

  const colon = title.lastIndexOf(': ', TITLE_MAX);
  const beforeColon = title.slice(0, colon);
  return colon > 0 && fitsTitle(beforeColon) ? beforeColon : null;
}

export function seznamTitle(title: string, seoTitle?: string | null): string {
  const full = cleanFeedText(title);
  if (full.length <= TITLE_MAX) return full;
  const seo = cleanFeedText(seoTitle);
  if (fitsTitle(seo)) return seo;
  return cutHeadline(full) ?? full;
}

// Řadová číslovka, iniciála nebo zkratka na konci úseku větu nekončí.
// Když tenhle seznam něco mine, je to bezpečné jen jedním směrem: neroztržená věta
// je delší, roztržená by porušila pravidlo „jen celé věty“.
const NOT_SENTENCE_END = /(?:^|[\s(])(?:\d{1,2}|\p{L}|mil|mld|tis|tzv|např|resp|tj|apod|atd|aj|čl|odst|písm|str|min|max|ing|mgr|bc|dr|doc|prof)\.$/iu;
const SENTENCE_BOUNDARY = /[.!?…]+["“”')\]]*\s+(?=[\p{Lu}„"])/gu;
const FINISHED = /[.!?]["“”')\]]*$/;

function splitSentences(text: string): string[] {
  const out: string[] = [];
  let start = 0;
  for (const m of text.matchAll(SENTENCE_BOUNDARY)) {
    const candidate = text.slice(start, m.index + m[0].trimEnd().length);
    if (NOT_SENTENCE_END.test(candidate)) continue;
    out.push(candidate);
    start = m.index + m[0].length;
  }
  out.push(text.slice(start));
  return out;
}

export function seznamDescription(perex: string | null | undefined, seoDescription?: string | null): string {
  const text = cleanFeedText(perex) || cleanFeedText(seoDescription);
  if (!text) return '';

  const sentences = splitSentences(text);
  const last = sentences[sentences.length - 1];
  if (!FINISHED.test(last)) {
    if (sentences.length > 1) sentences.pop();
    else sentences[0] = `${last.replace(/[\s,;:…–—.-]+$/, '')}.`;
  }

  let out = sentences[0];
  for (const s of sentences.slice(1)) {
    if (out.length + 1 + s.length > DESCRIPTION_MAX) break;
    out += ` ${s}`;
  }
  return out;
}

export function seznamImageUrl(slug: string): string {
  return `${SITE_URL}/rss-seznam/${slug}.jpg`;
}

// Adresa jde z databáze rovnou do fetch na serveru, tak jen z hostů, které známe.
// Zástupný obrázek je logo webu, a obrázky s logem Seznam zakazuje.
const IMAGE_HOSTS = new Set([
  'agro-svet.cz',
  'cdn.samecdigital.com',
  'images.pexels.com',
  'images.unsplash.com',
  'upload.wikimedia.org',
]);

function isPlaceholderImage(url: string): boolean {
  // Registr drží kopie záznamů, takže porovnání hodnot, ne identity.
  const credit = creditFor(url);
  return credit?.author === ZASTUPNY.author && credit.license === ZASTUPNY.license;
}

export function seznamImageSource(url: string | null | undefined): string | null {
  if (!url || isPlaceholderImage(url)) return null;
  try {
    const parsed = new URL(url, SITE_URL);
    return parsed.protocol === 'https:' && IMAGE_HOSTS.has(parsed.hostname) ? parsed.href : null;
  } catch {
    return null;
  }
}

export interface FocalPoint {
  x?: number | null;
  y?: number | null;
}

/** Výřez 16:9 kolem ohniska (`articles.focal_point`, procenta), který nevyjede z obrázku. */
export function cropBox16x9(width: number, height: number, focal?: FocalPoint | null) {
  const cropWidth = Math.min(width, Math.round((height * 16) / 9));
  const cropHeight = Math.min(height, Math.round((width * 9) / 16));
  const place = (size: number, crop: number, percent: number) =>
    Math.min(size - crop, Math.max(0, Math.round((size * percent) / 100 - crop / 2)));
  return {
    left: place(width, cropWidth, focal?.x ?? 50),
    top: place(height, cropHeight, focal?.y ?? 50),
    width: cropWidth,
    height: cropHeight,
  };
}

export function photoCreditLine(credit: Pick<PhotoCredit, 'author' | 'license'> | null | undefined): string {
  const parts = [credit?.author, credit?.license].map((p) => cleanFeedText(p)).filter(Boolean);
  return parts.length ? `Foto: ${parts.join(', ')}` : '';
}

/** Kredit k fotce článku, stejný jako na webu: sloupec z CMS, pak registr podle názvu souboru. */
export function articlePhotoCredit(article: Pick<SeznamArticle, 'featured_image_url' | 'featured_image_credit'>): string {
  return photoCreditLine(creditFromArticle(article.featured_image_credit as never, article.featured_image_url));
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

function renderItem(a: SeznamArticle, description: string): string {
  const url = `${SITE_URL}/novinky/${a.slug}/`;
  const catSlug = a.category ? newsCategorySlug(a.category) : null;
  const categoryLabel = catSlug ? localizedCategory('cs', catSlug) : '';
  const lines = [
    `<title>${xmlEscape(seznamTitle(a.title, a.seo_title))}</title>`,
    `<link>${xmlEscape(url)}</link>`,
    // Podle CLAUDE.md se UUID článků mezi databázemi liší, stálý je slug.
    `<guid isPermaLink="true">${xmlEscape(url)}</guid>`,
    `<pubDate>${new Date(a.published_at).toUTCString()}</pubDate>`,
  ];
  if (categoryLabel) lines.push(`<category>${xmlEscape(categoryLabel)}</category>`);
  lines.push(`<description>${xmlEscape(description)}</description>`);
  if (seznamImageSource(a.featured_image_url)) {
    // media:content, ne szn:image: jen k němu jde přidat popis a v něm kredit fotky.
    lines.push(`<media:content url="${xmlEscape(seznamImageUrl(a.slug))}" type="image/jpeg" medium="image" />`);
    const credit = articlePhotoCredit(a);
    if (credit) lines.push(`<media:description type="text/plain">${xmlEscape(credit)}</media:description>`);
  }
  return `    <item>\n${lines.map((l) => `      ${l}`).join('\n')}\n    </item>`;
}

export function buildSeznamFeed(rows: SeznamArticle[]): string {
  const items = rows
    .map((a) => ({ a, description: seznamDescription(a.perex, a.seo_description) }))
    .filter(({ description }) => description)
    .slice(0, ITEM_LIMIT);
  const newest = items[0]?.a.published_at;
  const buildDate = (newest ? new Date(newest) : new Date()).toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${xmlEscape(t('cs', 'rss.title'))}</title>
    <link>${SITE_URL}/novinky/</link>
    <description>${xmlEscape(t('cs', 'rss.desc'))}</description>
    <language>${bcp47('cs')}</language>
    <atom:link href="${SITE_URL}/rss-seznam.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${buildDate}</lastBuildDate>
${items.map(({ a, description }) => renderItem(a, description)).join('\n')}
  </channel>
</rss>`;
}
