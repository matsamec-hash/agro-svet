import { describe, it, expect } from 'vitest';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LAUNCHED_PREFIXES, isPrerenderedOnlyPath } from '../../src/i18n/utils';

// PROČ: `/uk/zebricky/` po launchi zobrazovalo české „Metodika" a „Traktory",
// protože ty nadpisy visely natvrdo v šabloně — i18n modul vypadal kompletní,
// grep na českou diakritiku je nenašel (nemají háčky) a t() fallback je řešit
// nemůže, protože žádný klíč neexistoval. Stejná past byla v /sezona, /akcie,
// /puda a dvou kalkulačkách.
//
// Test čte šablony sekcí launchnutých pro jinou locale než cs a hledá nadpis
// s literálním textem. Soubory s vlastní jazykovou větví (`locale === 'sk'`,
// `isPl`, …) se přeskakují — tam je literál záměrný, protože každá větev má
// svoji variantu textu.

const PAGES = join(process.cwd(), 'src/pages');

/** Sekce, které existují JEN pro jednu non-cs locale — literál je tam v jejím
 *  jazyce a překládat ho není co. */
const SINGLE_LOCALE_SECTIONS = ['/doplaty-bezposrednie', '/ekoschematy', '/poradniki', '/direktzahlungen', '/oeko-regelungen', '/oepul', '/direktzahlungen-oesterreich'];

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.astro')) out.push(p);
  }
  return out;
}

describe('šablony launchnutých sekcí nemají nadpis natvrdo', () => {
  it('žádný <h1>–<h3> s literálním textem', () => {
    const launched = new Set(
      Object.entries(LAUNCHED_PREFIXES)
        .filter(([locale]) => locale !== 'cs')
        .flatMap(([, prefixes]) => prefixes)
        .filter((p) => p !== '/' && !SINGLE_LOCALE_SECTIONS.includes(p)),
    );
    expect(launched.size).toBeGreaterThan(10); // test není slepý

    const hits: string[] = [];
    let scanned = 0;

    for (const file of walk(PAGES)) {
      const rel = file.slice(PAGES.length);
      const section = `/${rel.split('/')[1] ?? ''}`;
      if (!launched.has(section)) continue;

      const src = readFileSync(file, 'utf8');
      // Soubor s vlastní jazykovou větví (včetně cs-only bloků) řeší text sám.
      if (/locale === '(cs|sk|pl|uk)'|isSk|isPl|isUk/.test(src)) continue;
      // Prerendered cs-only cesty se pod locale prefixem nezobrazí.
      const route = rel.replace(/\/index\.astro$/, '/').replace(/\.astro$/, '/').replace(/\[[^\]]+\]/g, 'x');
      if (isPrerenderedOnlyPath(route)) continue;

      scanned++;
      const body = src.slice(src.indexOf('\n---', 3) + 4);
      for (const m of body.matchAll(/<h([1-3])[^>]*>([^<{}]{2,60})<\/h\1>/g)) {
        if (/^[\s\d.,%—–-]*$/.test(m[2])) continue; // čísla/interpunkce nejsou text
        hits.push(`${rel}: <h${m[1]}>${m[2].trim()}</h${m[1]}>`);
      }
    }

    expect(scanned).toBeGreaterThan(5); // opravdu se něco prošlo
    expect(hits, `natvrdo psané nadpisy:\n${hits.join('\n')}`).toEqual([]);
  });
});
