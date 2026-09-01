import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { searchGroupsFor, SEARCH_GROUP_SECTIONS, LAUNCHED_PREFIXES, isLaunchedPath } from '../../src/i18n/utils';
import { locales, defaultLocale, type Locale } from '../../src/i18n/config';
import cs from '../../src/i18n/ui/cs';
import sk from '../../src/i18n/ui/sk';
import pl from '../../src/i18n/ui/pl';
import uk from '../../src/i18n/ui/uk';
import de from '../../src/i18n/ui/de';

// PROČ: /hledat bylo launchnuté pro sk/pl/uk a přitom mělo 18 řetězců natvrdo
// česky („Novinky", „Technika", „Všechny články", „Nalezeno celkem…"), odkazy
// na výsledky mířily na NEprefixované cs URL a prohledávalo české `articles`
// i český bazar. Stránka je noindex, takže si toho nikdo nevšiml — přesto je to
// vstupní bod z lupy v hlavičce.

const ROOT = join(process.cwd(), 'src');
const MAPS: Record<string, Record<string, string>> = { cs, sk, pl, uk, de };

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.astro')) out.push(p);
  }
  return out;
}

const HLEDAT = readFileSync(join(ROOT, 'pages/hledat.astro'), 'utf8');

describe('/hledat — gatování skupin podle launchnutých sekcí', () => {
  it('vrací přesně ty skupiny, které daná locale umí obsloužit', () => {
    expect(searchGroupsFor('cs')).toEqual(['novinky', 'stroje', 'plemena', 'bazar']);
    // sk a pl mají /novinky launchnuté (reálné překlady přes article_translations)
    expect(searchGroupsFor('sk')).toEqual(['novinky', 'stroje', 'plemena']);
    expect(searchGroupsFor('pl')).toEqual(['novinky', 'stroje', 'plemena']);
    // uk a de /novinky launchnuté NEMAJÍ → skupina se ani nedotáže, ani neslíbí
    expect(searchGroupsFor('uk')).toEqual(['stroje', 'plemena']);
    expect(searchGroupsFor('de')).toEqual(['stroje', 'plemena']);
  });

  it('každá nabídnutá skupina má v dané locale launchnutou cílovou sekci', () => {
    const bad: string[] = [];
    for (const locale of locales as readonly Locale[]) {
      for (const id of searchGroupsFor(locale)) {
        const section = SEARCH_GROUP_SECTIONS[id];
        if (section === null) continue; // cs-only skupina, řeší test níž
        if (locale === defaultLocale) continue;
        if (!isLaunchedPath(locale, section)) bad.push(`${locale}: skupina ${id} → ${section} není launchnutá`);
      }
    }
    expect(bad, `výsledek by odkazoval na české URL:\n${bad.join('\n')}`).toEqual([]);
  });

  it('bazar se nabízí jen v cs — inzeráty jsou české texty s cenami v Kč', () => {
    for (const locale of locales as readonly Locale[]) {
      expect(searchGroupsFor(locale).includes('bazar')).toBe(locale === defaultLocale);
    }
  });

  it('hledat.astro si podmínku neodvozuje sám, bere ji ze searchGroupsFor', () => {
    // Dvě nezávislé kopie téže podmínky se dřív nebo později rozejdou: stránka
    // by pak slibovala sekci, do které se nikdy nedotáže (viz výčet „co
    // prohledáváme" vs. skutečné skupiny).
    expect(HLEDAT).toContain('searchGroupsFor(locale)');
    expect(HLEDAT).not.toContain('isLaunchedPath(');
  });

  it('ne-cs články se hledají v article_translations, ne v českých articles', () => {
    // Fulltext nad českým `title`/`perex` by pod /pl reagoval na české slovo
    // a vypsal článek, který polsky vůbec není.
    expect(HLEDAT).toContain("from('article_translations')");
    expect(HLEDAT).toContain('hasTranslatedTitle');
  });
});

describe('/hledat — žádná čeština natvrdo', () => {
  it('šablona neobsahuje český řetězec mimo překladač', () => {
    const end = HLEDAT.indexOf('\n---', 3);
    const body = HLEDAT.slice(end + 4);
    // Diakritika je na KÓD spolehlivá (na obsahové overlaye ne — tam jsou česká
    // vlastní jména legitimní). Šablona /hledat žádný obsah nenese.
    const hits = body.match(/[ěščřžýáíéúůňťďó][\wěščřžýáíéúůňťďó]*/gi) ?? [];
    expect(hits, `čeština v šabloně: ${hits.join(', ')}`).toEqual([]);
  });

  it('všechny search.* klíče existují ve všech locale a nejsou prázdné', () => {
    const keys = Object.keys(cs).filter((k) => k.startsWith('search.'));
    expect(keys.length).toBeGreaterThanOrEqual(23);
    const missing: string[] = [];
    for (const locale of locales as readonly Locale[]) {
      for (const k of keys) {
        const v = MAPS[locale]?.[k];
        if (typeof v !== 'string' || v.trim() === '') missing.push(`${locale}: ${k}`);
      }
    }
    expect(missing, `chybějící klíč → tichý fallback do češtiny:\n${missing.join('\n')}`).toEqual([]);
  });

  it('de a uk se u search.* neshodují s češtinou ani v jednom klíči', () => {
    // Vzdálené jazyky: shoda s cs znamená zapomenutý překlad, ne náhodu.
    // (U sk/pl by tenhle test dával falešné poplachy — „Technika" je shodná.)
    const keys = Object.keys(cs).filter((k) => k.startsWith('search.'));
    const same: string[] = [];
    for (const locale of ['de', 'uk'] as const) {
      for (const k of keys) if (MAPS[locale][k] === cs[k]) same.push(`${locale}: ${k} = „${cs[k]}"`);
    }
    expect(same, `nepřeložené klíče:\n${same.join('\n')}`).toEqual([]);
  });
});

describe('formuláře — action nesmí obcházet locale prefix', () => {
  it('žádná .astro nemá natvrdo action na cestu, která je někde launchnutá', () => {
    // Natvrdo psané action="/hledat/" v hlavičce i v katalogu posílalo hledání
    // z /de|/uk|/pl|/sk na ČESKOU stránku vyhledávání. Pravidlo se udržuje samo:
    // jakmile se nějaká sekce launchne, hardcoded formulář na ni začne padat.
    const launchedSomewhere = new Set(
      (locales as readonly Locale[])
        .filter((l) => l !== defaultLocale)
        .flatMap((l) => LAUNCHED_PREFIXES[l])
        .filter((p) => p !== '/'),
    );
    const bad: string[] = [];
    for (const f of walk(ROOT)) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/action="(\/[^"]*)"/g)) {
        const root = '/' + (m[1].split('/')[1] ?? '');
        if (launchedSomewhere.has(root)) bad.push(`${f.replace(process.cwd() + '/', '')}: action="${m[1]}"`);
      }
    }
    expect(bad, `formulář obchází locale prefix:\n${bad.join('\n')}`).toEqual([]);
  });
});
