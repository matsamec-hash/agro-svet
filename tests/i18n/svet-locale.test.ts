import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  SVET_LANGS, SVET_REFERENCE, COUNTRY_NAMES, INDICATOR_LABELS, METRIC_LABELS,
  METRIC_NOTES, METRIC_SOURCE, PACKAGE_LABELS, GROUP_LABELS, REGION_LABELS,
  REGION_METRIC, REGION_LEVEL_NOTE, regionPhrase, isSvetLang,
} from '../../src/i18n/svet';
import { locales, defaultLocale, type Locale } from '../../src/i18n/config';
import { LAUNCHED_PREFIXES } from '../../src/i18n/utils';

// PROČ: /svet mělo lokalizaci natvrdo zadrátovanou na dva jazyky —
// `type SvetLang = 'sk' | 'pl'` a pět nezávislých strážců tvaru
// `if (locale !== 'sk' && locale !== 'pl') return m`. Přidat jazyk tedy
// neznamenalo doplnit data, ale najít všechny podmínky; dokud se nenajdou,
// nový jazyk TIŠE dostane české hodnoty a nikdo si toho nevšimne.
// Stejná past byla v `numLocale` (formát čísel) a v `homeCode` — /de by
// dostalo české formátování a na mapě zvýrazněné Česko.

const SVET_DIRS = ['src/pages/svet', 'src/components/svet'];
const NAMED_MAPS: Record<string, Record<string, any>> = {
  COUNTRY_NAMES, INDICATOR_LABELS, METRIC_LABELS, METRIC_NOTES,
  METRIC_SOURCE, PACKAGE_LABELS, GROUP_LABELS, REGION_METRIC,
};

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.astro')) out.push(p);
  }
  return out;
}
const SVET_FILES = SVET_DIRS.flatMap((d) => walk(join(process.cwd(), d)));

describe('/svet — pokrytí jazyků', () => {
  it('SVET_LANGS obsahuje každý locale kromě výchozího', () => {
    // Invariant na třídu: až přibude šestý jazyk, spadne to tady, ne až
    // na produkci českým labelem uprostřed cizí stránky.
    const expected = (locales as readonly Locale[]).filter((l) => l !== defaultLocale);
    expect([...SVET_LANGS].sort()).toEqual([...expected].sort());
    for (const l of expected) expect(isSvetLang(l)).toBe(true);
    expect(isSvetLang(defaultLocale)).toBe(false);
  });

  it('každá překladová mapa má neprázdnou hodnotu pro každý jazyk', () => {
    const bad: string[] = [];
    for (const [name, map] of Object.entries(NAMED_MAPS)) {
      for (const [key, entry] of Object.entries(map)) {
        for (const lang of SVET_LANGS) {
          const v = (entry as any)[lang];
          const ok = name === 'REGION_METRIC'
            ? v && typeof v.label === 'string' && v.label.trim() !== '' && typeof v.desc === 'string' && v.desc.trim() !== ''
            : typeof v === 'string' && v.trim() !== '';
          if (!ok) bad.push(`${name}.${key}.${lang}`);
        }
      }
    }
    expect(bad, `chybí překlad → tichý fallback do češtiny:\n${bad.join('\n')}`).toEqual([]);
  });

  it('mapy s českou variantou (regiony) pokrývají všechny locale', () => {
    const bad: string[] = [];
    for (const [key, e] of Object.entries(REGION_LABELS)) {
      for (const l of locales as readonly Locale[]) {
        if (typeof (e as any)[l] !== 'string' || !(e as any)[l].trim()) bad.push(`REGION_LABELS.${key}.${l}`);
      }
    }
    for (const [key, e] of Object.entries(REGION_LEVEL_NOTE)) {
      for (const l of locales as readonly Locale[]) {
        if (typeof (e as any)[l] !== 'string' || !(e as any)[l].trim()) bad.push(`REGION_LEVEL_NOTE.${key}.${l}`);
      }
    }
    expect(bad, `chybí varianta:\n${bad.join('\n')}`).toEqual([]);
    // regionPhrase nesmí spadnout na češtinu u jazyka, který variantu má
    expect(regionPhrase('Střední', 'de')).toBe('Mitteleuropa');
    expect(regionPhrase('Střední', 'uk')).toBe('Центральна Європа');
    expect(regionPhrase('Střední', 'cs')).toBe('Střední Evropa');
  });

  it('de a uk se u názvů zemí neshodují se slovenštinou ani polštinou', () => {
    // Vzdálené jazyky: shoda by znamenala zkopírovaný, ne přeložený záznam.
    // (Výjimky jsou reálné — Malta, USA, Litva se píšou stejně.)
    const SHARED = new Set(['malta', 'usa', 'litva', 'island', 'portugalsko']);
    const same: string[] = [];
    for (const [slug, e] of Object.entries(COUNTRY_NAMES)) {
      if (SHARED.has(slug)) continue;
      if (e.de === e.sk || e.de === e.pl) same.push(`de: ${slug} = „${e.de}"`);
    }
    expect(same, `podezřelá shoda:\n${same.join('\n')}`).toEqual([]);
  });
});

describe('/svet — referenční země', () => {
  it('každý locale má referenci, která v datech existuje', () => {
    for (const l of locales as readonly Locale[]) {
      const slug = SVET_REFERENCE[l];
      expect(slug, `${l} nemá referenční zemi`).toBeTruthy();
      expect(COUNTRY_NAMES[slug], `${l}: ${slug} není v COUNTRY_NAMES`).toBeDefined();
    }
  });

  it('de se poměřuje s Německem a uk s Ukrajinou, ne s Českem', () => {
    // „O 12 % víc než v Česku" je pro německého čtenáře údaj o cizí zemi.
    expect(SVET_REFERENCE.de).toBe('nemecko');
    expect(SVET_REFERENCE.uk).toBe('ukrajina');
    // cs/sk/pl zůstávají u Česka — jejich nasazený výstup se nemění.
    expect(SVET_REFERENCE.cs).toBe('cesko');
    expect(SVET_REFERENCE.sk).toBe('cesko');
    expect(SVET_REFERENCE.pl).toBe('cesko');
  });

  it('žádná stránka /svet si referenci nepíše natvrdo', () => {
    const bad: string[] = [];
    for (const f of SVET_FILES) {
      for (const [i, line] of readFileSync(f, 'utf8').split('\n').entries()) {
        if (line.trimStart().startsWith('//')) continue;
        // `?? 'cesko'` je povolený default; `=== 'cesko'` nebo `['cesko']` ne.
        if (/(===\s*'cesko'|\['cesko'\]|slug:\s*'cesko')/.test(line)) {
          bad.push(`${f.replace(process.cwd() + '/', '')}:${i + 1}`);
        }
      }
    }
    expect(bad, `reference zabetonovaná do češtiny:\n${bad.join('\n')}`).toEqual([]);
  });
});

describe('/svet — žádné dvoujazyčné ternáře', () => {
  it('v sekci nezůstal strážce typu `locale === \'sk\' ? … : locale === \'pl\'`', () => {
    // Přesně tenhle tvar způsobil, že /de i /uk dostávaly české formátování
    // čísel a na mapě zvýrazněné Česko. Mapa přes locale to udělá viditelným.
    const bad: string[] = [];
    for (const f of SVET_FILES) {
      for (const [i, line] of readFileSync(f, 'utf8').split('\n').entries()) {
        if (line.trimStart().startsWith('//')) continue;
        if (/locale\s*===\s*'(sk|pl)'/.test(line)) bad.push(`${f.replace(process.cwd() + '/', '')}:${i + 1}: ${line.trim().slice(0, 90)}`);
      }
    }
    expect(bad, `dvoujazyčný ternář — příští jazyk tiše dostane češtinu:\n${bad.join('\n')}`).toEqual([]);
  });

  it('každý UI blok v sekci má variantu pro všechny launchnuté jazyky', () => {
    const bad: string[] = [];
    for (const f of SVET_FILES) {
      const src = readFileSync(f, 'utf8');
      // UI blok poznáme podle `cs: {` na začátku odsazeného řádku uvnitř const
      if (!/^\s{2}cs: \{/m.test(src)) continue;
      for (const l of locales as readonly Locale[]) {
        if (l === defaultLocale) continue;
        if (!isLaunchedPath(l, '/svet')) continue;
        if (!new RegExp(`^\\s{2}${l}: \\{`, 'm').test(src)) {
          bad.push(`${f.replace(process.cwd() + '/', '')}: chybí blok ${l}`);
        }
      }
    }
    expect(bad, `UI blok bez jazyka → česká stránka pod cizím chrome:\n${bad.join('\n')}`).toEqual([]);
  });
});

function isLaunchedPath(locale: Locale, p: string): boolean {
  return (LAUNCHED_PREFIXES[locale] ?? []).some((x) => x === p || p.startsWith(`${x}/`));
}
