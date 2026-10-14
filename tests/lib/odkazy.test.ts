import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { legacyRedirectTarget } from '../../src/lib/legacy-redirects';
import {
  categoryListingPath,
  getAllBrands,
  getFunctionalGroupForCategory,
  seriesFamily,
  FUNCTIONAL_GROUPS,
  type StrojKategorie,
} from '../../src/lib/stroje';
import { udrzovatelHref, listIndexableUdrzovatele, listUdrzovatele } from '../../src/lib/plodiny';
import { getSlovnik } from '../../src/lib/slovnik';
import { SLOVNIK_DE } from '../../src/lib/slovnik.de';
import { langSwitchHref, LOCALE_ONLY_SECTIONS } from '../../src/i18n/utils';
import { HIDDEN_NEWS_CATEGORIES } from '../../src/i18n/nav';
import { activeLocales } from '../../src/i18n/config';

// Nefunkční interní odkazy z crawlu 2026-10 (GSC: 1 671× 404, 54× 5xx).

describe('legacy redirecty (301 z dřív rozbitých odkazů)', () => {
  it.each([
    ['/stroje/zemedelske-stroje/lisy-valcove/', '/stroje/lisy-valcove/'],
    ['/stroje/zemedelske-stroje/zaci-stroje/', '/stroje/zaci-stroje/'],
    ['/stroje/zemedelske-stroje/rezacky/', '/stroje/rezacky-samojizdne/'],
    ['/stroje/zemedelske-stroje/postrikovace/', '/stroje/postrikovace-samojizdne/'],
    ['/stroje/rezacky/', '/stroje/rezacky-samojizdne/'],
    ['/stroje/postrikovace/', '/stroje/postrikovace-samojizdne/'],
    ['/slovnik/dzes/cs.wikipedia.org/wiki/Dobr%C3%BD_zem%C4%9Bd%C4%9Blsk%C3%BD_a_environment%C3%A1ln%C3%AD_stav/', '/slovnik/dzes/'],
    ['/slovnik/intercooler/uk.wikipedia.org/wiki/Intercooler/', '/slovnik/intercooler/'],
  ])('%s → %s', (from, to) => {
    expect(legacyRedirectTarget(from)).toBe(to);
  });

  it.each([
    '/stroje/zemedelske-stroje/',
    '/stroje/zemedelske-stroje/sklizen-picnin/', // funkční skupina = platná stránka
    '/stroje/zemedelske-stroje/neexistuje/',
    '/stroje/lisy-valcove/',
    '/stroje/john-deere/',
    '/stroje/john-deere/rada/rezacky/8/',
    '/slovnik/dzes/',
    '/slovnik/',
  ])('%s zůstává bez přesměrování', (path) => {
    expect(legacyRedirectTarget(path)).toBeNull();
  });

  it('pravidlo pro skupiny přesměruje každou subkategorii, ne skupinu', () => {
    for (const [group, g] of Object.entries(FUNCTIONAL_GROUPS)) {
      expect(legacyRedirectTarget(`/stroje/zemedelske-stroje/${group}/`)).toBeNull();
      for (const sub of g.categories) expect(legacyRedirectTarget(`/stroje/zemedelske-stroje/${sub}/`)).toBe(`/stroje/${sub}/`);
    }
  });
});

describe('stroje — výpis kategorie pro každý klíč z YAML značek', () => {
  it('každý top-level klíč vede na traktory/kombajny, skupinu nebo subkategorii', () => {
    for (const brand of getAllBrands()) {
      for (const key of Object.keys(brand.categories ?? {})) {
        const path = categoryListingPath(key);
        const seg = path.split('/').filter(Boolean);
        const ok =
          path === `/stroje/${key}/` && (key === 'traktory' || key === 'kombajny')
            ? true
            : seg[1] === 'zemedelske-stroje'
              ? seg.length === 3 && seg[2] in FUNCTIONAL_GROUPS
              : getFunctionalGroupForCategory(seg[1] as StrojKategorie) !== null;
        expect(ok, `${brand.slug}: ${key} → ${path}`).toBe(true);
      }
    }
  });
});

describe('detail odrůdy — udržovatel', () => {
  it('odkaz jen na udržovatele, kteří mají vlastní stránku', () => {
    const indexable = new Set(listIndexableUdrzovatele().map((u) => u.slug));
    let withPage = 0;
    let without = 0;
    for (const u of listUdrzovatele()) {
      const href = udrzovatelHref(u.name);
      if (indexable.has(u.slug)) { expect(href).toBe(`/odrudy/udrzovatel/${u.slug}/`); withPage++; }
      else { expect(href).toBeNull(); without++; }
    }
    expect(withPage).toBeGreaterThan(0);
    expect(without).toBeGreaterThan(0);
    expect(udrzovatelHref('')).toBeNull();
    expect(udrzovatelHref(null)).toBeNull();
  });
});

describe('slovník — externí odkaz', () => {
  it('externalUrl je absolutní URL (bez https:// se složil jako relativní /slovnik/<heslo>/cs.wikipedia.org/… = 404)', () => {
    const all = [...activeLocales.map((l) => getSlovnik(l)), SLOVNIK_DE].flat();
    for (const term of all) {
      if (term.externalUrl) expect(term.externalUrl, term.slug).toMatch(/^https?:\/\//);
    }
  });
});

describe('přepínač jazyka', () => {
  it('jednojazyčná sekce: ostatní jazyky na homepage, vlastník na stránku', () => {
    expect(langSwitchHref('cs', '/poradniki/jak-dobrac-opony-rolnicze/', [])).toBe('/');
    expect(langSwitchHref('cs', '/poradniki/', [])).toBe('/');
    expect(langSwitchHref('cs', '/doplaty-bezposrednie/', [])).toBe('/');
    expect(langSwitchHref('cs', '/ekoschematy/', [])).toBe('/');
    expect(langSwitchHref('sk', '/ekoschematy/', [])).toBe('/sk/');
    expect(langSwitchHref('pl', '/poradniki/jak-dobrac-opony-rolnicze/', [])).toBe('/pl/poradniki/jak-dobrac-opony-rolnicze/');
    // de je stažená (410) — vlastníka ověř jen u servírovaných jazyků.
    for (const [section, owner] of Object.entries(LOCALE_ONLY_SECTIONS)) {
      if (!activeLocales.includes(owner)) continue;
      expect(langSwitchHref(owner, `/${section}/`, [])).toBe(`/${owner}/${section}/`);
      expect(langSwitchHref('cs', `/${section}/`, [])).toBe('/');
    }
  });

  it('skrytá kategorie novinek pod uk vede na hub novinek', () => {
    expect(langSwitchHref('uk', '/novinky/kategorie/dotace/', HIDDEN_NEWS_CATEGORIES.uk)).toBe('/uk/novinky/');
    expect(langSwitchHref('uk', '/novinky/kategorie/legislativa/', HIDDEN_NEWS_CATEGORIES.uk)).toBe('/uk/novinky/');
  });
});

// ---------------------------------------------------------------------------
// Natvrdo psané odkazy v .astro stránkách (průvodce, přehledy) — slug překlep
// nebo neexistující řada se dřív dostal až do produkce (/stroje/zetor/proxima/,
// /jak-na-to/kontrola-ojeteho-traktoru-pred-koupi-checklist/, /slovnik/precizni-zemedelstvi/).
// ---------------------------------------------------------------------------

function astroFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? astroFiles(p) : p.endsWith('.astro') ? [p] : [];
  });
}

describe('natvrdo psané interní odkazy ve stránkách', () => {
  const hrefs: { file: string; path: string }[] = [];
  for (const file of [...astroFiles('src/pages'), ...astroFiles('src/components')]) {
    for (const m of readFileSync(file, 'utf8').matchAll(/href="(\/[^"{}$`#?]*)"/g)) {
      hrefs.push({ file, path: m[1].replace(/^\/(sk|uk|pl)(?=\/)/, '') });
    }
  }

  it('/slovnik/<heslo>/ existuje', () => {
    const slugs = new Set(getSlovnik('cs').map((t) => t.slug));
    for (const { file, path } of hrefs) {
      const m = path.match(/^\/slovnik\/([^/]+)\/$/);
      if (m && m[1] !== 'slug') expect(slugs.has(m[1]), `${file}: ${path}`).toBe(true);
    }
  });

  it('/jak-na-to/<návod>/ existuje', () => {
    const slugs = new Set(readdirSync('src/content/howto').map((f) => f.replace(/\.md$/, '')));
    for (const { file, path } of hrefs) {
      const m = path.match(/^\/jak-na-to\/([^/]+)\/$/);
      if (m) expect(slugs.has(m[1]), `${file}: ${path}`).toBe(true);
    }
  });

  it('/stroje/<značka>/<řada>/ a /stroje/<značka>/rada/<kategorie>/<rodina>/ existují', () => {
    const brands = new Map(getAllBrands().map((b) => [b.slug, b]));
    const RESERVED = new Set(['traktory', 'kombajny', 'zemedelske-stroje']);
    for (const { file, path } of hrefs) {
      const seg = path.split('/').filter(Boolean);
      if (seg[0] !== 'stroje' || seg.length < 3 || RESERVED.has(seg[1])) continue;
      const brand = brands.get(seg[1]);
      expect(brand, `${file}: ${path}`).toBeTruthy();
      const cats = Object.entries(brand!.categories ?? {});
      if (seg[2] === 'rada') {
        const cat = brand!.categories?.[seg[3] as StrojKategorie];
        expect(cat, `${file}: ${path}`).toBeTruthy();
        const fams = new Set(cat!.series.map((s) => String(s.family ?? seriesFamily(s.slug))));
        expect(fams.has(seg[4]), `${file}: ${path}`).toBe(true);
      } else {
        const series = cats.flatMap(([, c]) => c.series ?? []).find((s) => s.slug === seg[2]);
        expect(series, `${file}: ${path}`).toBeTruthy();
      }
    }
  });
});
