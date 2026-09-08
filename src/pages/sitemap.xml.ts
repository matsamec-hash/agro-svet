import type { APIRoute } from 'astro';
import { buildSitemapEntries, sitemapSection, SITEMAP_SECTIONS, xmlEscape } from '../lib/sitemap-entries';
import { SITE_URL } from '../lib/config';

// /sitemap.xml je od 9/2026 sitemap INDEX, ne urlset. Dřív to byl jeden soubor
// s ~40 700 URL a 8,2 MB — pod limitem (50 000 / 50 MB), ale v Search Consoli
// z něj nešlo vyčíst nic užitečného: „odesláno 40 707, indexováno 12 000" bez
// informace, která sekce nebo jazyk chybí. Dílčí sitemapy to rozpadnou.
// Sekce se odvozuje z URL (viz sitemapSection), ne z místa v kódu.

export const GET: APIRoute = async () => {
  const entries = await buildSitemapEntries();

  // Nejnovější lastmod v sekci = lastmod dílčí sitemapy. Prázdné sekce
  // (např. jazyk, který ještě není spuštěný) se do indexu vůbec nedostanou —
  // odkaz na sitemapu bez URL je v GSC hlášený jako chyba.
  const newest = new Map<string, string | undefined>();
  const counts = new Map<string, number>();
  for (const e of entries) {
    const s = sitemapSection(e.loc);
    counts.set(s, (counts.get(s) ?? 0) + 1);
    const cur = newest.get(s);
    const d = e.lastmod?.slice(0, 10);
    if (d && (!cur || d > cur)) newest.set(s, d);
  }

  const body = SITEMAP_SECTIONS.filter((s) => (counts.get(s) ?? 0) > 0)
    .map((s) => {
      const lastmod = newest.get(s);
      return [
        '  <sitemap>',
        `    <loc>${xmlEscape(`${SITE_URL}/sitemap/${s}.xml`)}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        '  </sitemap>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
