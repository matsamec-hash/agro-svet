// tests/i18n/retired-locale.test.ts
// Stažená jazyková mutace (de, 2026-09-14). Hlídá, že „stažená" znamená
// opravdu neviditelná: žádný hreflang, nic v sitemapě, nic v navigaci a nic
// v přepínači jazyků. Samotné 410 na /de/* dělá middleware — testuje se tady
// přes stejnou podmínku, na které middleware stojí (isRetiredLocale).
//
// ‼️ Kdyby tenhle soubor začal padat po přidání jazyka, NEUPRAVUJ ho tak, aby
// prošel — buď je jazyk stažený, nebo není. Vrácení jazyka = smazat ho
// z RETIRED_LOCALES, pak tyhle testy přestanou dávat smysl jako celek.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  locales,
  activeLocales,
  RETIRED_LOCALES,
  isRetiredLocale,
  localeNames,
  type Locale,
} from '../../src/i18n/config';
import { LAUNCHED_PREFIXES, isLaunchedPath, searchGroupsFor } from '../../src/i18n/utils';
import { getNav, getFooterColumns } from '../../src/i18n/nav';
import { allowInMirror, MIRROR_LOCALES, type MirrorContext } from '../../src/lib/sitemap-mirror';

const RETIRED = RETIRED_LOCALES as readonly Locale[];

const EMPTY_CTX: MirrorContext = {
  articleMeta: new Map(),
  translatedIds: new Map(),
  howtoSlugs: new Map(),
};

describe('RETIRED_LOCALES', () => {
  it('de je stažené', () => {
    expect(isRetiredLocale('de')).toBe(true);
  });

  it('stažené locale je pořád platné locale (překlady se nemažou → jde vrátit)', () => {
    for (const l of RETIRED) {
      expect(locales).toContain(l);
      expect(localeNames[l]).toBeTruthy();
    }
  });

  it('activeLocales = locales bez stažených', () => {
    expect(activeLocales).toEqual(['cs', 'sk', 'uk', 'pl']);
    expect(activeLocales).not.toContain('de');
  });

  it('cs (default) stažené být nesmí — shodilo by celý web', () => {
    expect(isRetiredLocale('cs')).toBe(false);
  });
});

describe('stažené locale je mimo index', () => {
  it('isLaunchedPath je false pro KAŽDOU cestu, i tu v LAUNCHED_PREFIXES', () => {
    for (const l of RETIRED) {
      // Data schválně zůstala — právě proto se musí testovat, že je brána přebíjí.
      expect(LAUNCHED_PREFIXES[l].length).toBeGreaterThan(0);
      for (const p of LAUNCHED_PREFIXES[l]) {
        expect(isLaunchedPath(l, p), `${l} ${p}`).toBe(false);
        expect(isLaunchedPath(l, `${p}/neco/`), `${l} ${p}/neco/`).toBe(false);
      }
      expect(isLaunchedPath(l, '/')).toBe(false);
    }
  });

  it('živé jazyky brána nepotkala (žádná regrese)', () => {
    expect(isLaunchedPath('sk', '/stroje')).toBe(true);
    expect(isLaunchedPath('uk', '/stroje')).toBe(true);
    expect(isLaunchedPath('pl', '/stroje')).toBe(true);
  });
});

describe('stažené locale je mimo sitemapu', () => {
  it('allowInMirror neprojde ani jedna cesta', () => {
    for (const l of RETIRED) {
      if (!(MIRROR_LOCALES as readonly string[]).includes(l)) continue;
      for (const p of ['/', '/stroje/', '/znacky/', '/slovnik/', '/statistiky/']) {
        expect(allowInMirror(p, l as (typeof MIRROR_LOCALES)[number], EMPTY_CTX), `${l} ${p}`).toBe(false);
      }
    }
  });
});

describe('generátor sitemapy má poslední síto', () => {
  // Brána mirroru nestačí: jazykově výlučné landingy (/de/direktzahlungen/ a spol.)
  // se pushují napřímo mimo ni. Bez tohohle filtru zůstala /sitemap/de.xml
  // v indexu sitemap i po vypnutí němčiny — ověřeno na lokálním buildu.
  const src = fs.readFileSync(path.join(process.cwd(), 'src/lib/sitemap-entries.ts'), 'utf8');

  it('odfiltruje URL staženého jazyka až na konci, ne jen přes mirror', () => {
    expect(src).toContain('isRetiredLocale(seg)');
    expect(src.indexOf('isRetiredLocale(seg)')).toBeGreaterThan(src.indexOf('/de/direktzahlungen/'));
  });
});

describe('stažené locale je mimo navigaci a vyhledávání', () => {
  // Nav se pro stažený jazyk pořád sestaví (nikdo ji nevidí — /de/* je 410),
  // ale NESMÍ v ní zůstat jediný odkaz s prefixem staženého jazyka. To je ta
  // vlastnost, která se změnila: dokud byla mutace launchnutá, mířily tyhle
  // položky na /de/…; teď padají na cs cestu.
  it('nav ani footer neodkazuje na jedinou /<locale>/ URL', () => {
    for (const l of RETIRED) {
      const navHrefs = getNav(l).flatMap((i) => [i.href, ...(i.children ?? []).map((c) => c.href)]);
      const footHrefs = getFooterColumns(l).flatMap((c) => c.links.map((x) => x.href));
      const all = [...navHrefs, ...footHrefs].filter(Boolean) as string[];
      expect(all.length, 'nav se má pořád sestavit — jinak test nic nehlídá').toBeGreaterThan(0);
      expect(all.filter((h) => h.startsWith(`/${l}/`) || h === `/${l}`)).toEqual([]);
    }
  });

  it('/hledat pod staženým locale neprohledává nic', () => {
    for (const l of RETIRED) expect(searchGroupsFor(l)).toEqual([]);
  });
});

describe('přepínač jazyků', () => {
  const src = fs.readFileSync(path.join(process.cwd(), 'src/components/LangSwitcher.astro'), 'utf8');

  it('filtruje stažené mutace', () => {
    expect(src).toContain('.filter((o) => !isRetiredLocale(o.code))');
  });
});

describe('middleware 410', () => {
  const src = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf8');

  it('vrací 410, ne 404 ani redirect', () => {
    expect(src).toContain('isRetiredLocale(retiredPrefix)');
    expect(src).toContain('status: 410');
  });

  it('kryje i dílčí sitemapu /sitemap/<locale>.xml', () => {
    expect(src).toContain('isRetiredLocale(retiredSitemap)');
  });

  it('410 běží PŘED rewritem na cs routu (jinak by /de/ servírovalo české tělo)', () => {
    expect(src.indexOf('isRetiredLocale(retiredPrefix)')).toBeLessThan(src.indexOf('const { locale, path: strippedPath } = stripLocale'));
  });
});

describe('robots.txt stažené locale nezakazuje', () => {
  // Disallow by zabránil crawlu, takže by Googlebot 410 nikdy neuviděl
  // a URL by v indexu zůstaly viset donekonečna.
  const src = fs.readFileSync(path.join(process.cwd(), 'src/pages/robots.txt.ts'), 'utf8');

  it('žádný Disallow na staženou mutaci', () => {
    for (const l of RETIRED) {
      expect(src).not.toMatch(new RegExp(`^Disallow: /${l}/`, 'm'));
    }
  });
});
