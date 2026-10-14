import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { getAllModels } from '../../src/lib/stroje';
import { getSlovnik, slovnikSeoTitle, slovnikHasConverter } from '../../src/lib/slovnik';
import { machineSeoTitle, machineSeoDescription, machineTitleYears, encSeoTitle, firstFitting } from '../../src/lib/seo-titles';
import { pageTitle, TITLE_MAX } from '../../src/lib/head-meta';
import { useTranslations } from '../../src/i18n/utils';
import { activeLocales, type Locale } from '../../src/i18n/config';

const ROOT = join(import.meta.dirname, '../..');
// Prázdná/rozbitá hodnota, která by v titulku vypadala jako chyba webu.
const BROKEN = /undefined|null|NaN|\{\w+\}|\(\s*\)|:\s*$|,\s*$|—\s*$|\s{2}/;
const KEYWORD: Record<Locale, string> = {
  cs: 'technické údaje',
  sk: 'technické údaje',
  pl: 'dane techniczne',
  uk: 'технічні характеристики',
  de: 'technische Daten',
};
const PRICE = /\bcen[auy]?\b|\bціна\b|\bPreis\b/i;

describe('machineSeoTitle — detail modelu stroje', () => {
  it('Zetor 7745 (cs, stránka ukazuje cenu ojetiny): model, „technické údaje", výkon i roky', () => {
    expect(machineSeoTitle('cs', { name: 'Zetor 7745', powerHp: 77, yearFrom: 1980, yearTo: 1998, hasPrice: true }))
      .toBe('Zetor 7745 — technické údaje a cena: 77 k, 1980–1998');
  });

  it('bez ceny na stránce cenu neslibuje', () => {
    const t = machineSeoTitle('cs', { name: 'Zetor 7211', powerHp: 67, yearFrom: 1980, yearTo: 1998 });
    expect(t).toBe('Zetor 7211 — technické údaje: 67 k, 1980–1998');
    expect(t).not.toMatch(PRICE);
  });

  it('polsky ve tvaru „<Model> — dane techniczne …", ukrajinsky „технічні характеристики"', () => {
    expect(machineSeoTitle('pl', { name: 'Massey Ferguson 235', powerHp: 50, yearFrom: 1975, yearTo: 1986 }))
      .toBe('Massey Ferguson 235 — dane techniczne: 50 KM, 1975–1986');
    expect(machineSeoTitle('sk', { name: 'Zetor 7745', powerHp: 77, yearFrom: 1980, yearTo: 1998 }))
      .toBe('Zetor 7745 — technické údaje: 77 k, 1980–1998');
    // Plná verze by měla 66 znaků → roky vypadnou, výkon zůstane.
    expect(machineSeoTitle('uk', { name: 'Massey Ferguson 235', powerHp: 50, yearFrom: 1975, yearTo: 1986 }))
      .toBe('Massey Ferguson 235 — технічні характеристики: 50 к.с.');
  });

  it('vyráběný model má „od <rok>", model bez výkonu a roků jen „technické údaje"', () => {
    expect(machineTitleYears('cs', 2019, null)).toBe('od 2019');
    expect(machineTitleYears('uk', 2019, null)).toBe('з 2019');
    expect(machineTitleYears('cs', null, 1998)).toBe('');
    expect(machineSeoTitle('cs', { name: 'Fendt 942 Vario', powerHp: 415, yearFrom: 2019, yearTo: null }))
      .toBe('Fendt 942 Vario — technické údaje: 415 k, od 2019');
    expect(machineSeoTitle('cs', { name: 'Lemken Juwel 8', powerHp: null, yearFrom: null, yearTo: null }))
      .toBe('Lemken Juwel 8 — technické údaje');
    // Roky bez výkonu („technické údaje: od 2012") by se četly jako chyba.
    expect(machineSeoTitle('cs', { name: 'Fendt 5275 C', powerHp: null, yearFrom: 2012, yearTo: null }))
      .toBe('Fendt 5275 C — technické údaje');
  });

  // Celá třída, ne jen vzorek: všech ~2 000 modelů v každém servírovaném jazyce.
  it.each(activeLocales)('%s: každý model má titulek ≤ 60 znaků, bez prázdných hodnot a s klíčovým slovem', (locale) => {
    const bad: string[] = [];
    for (const m of getAllModels(locale)) {
      const name = `${m.brand_name} ${m.name}`;
      for (const hasPrice of [false, true]) {
        const title = machineSeoTitle(locale, { name, powerHp: m.power_hp, yearFrom: m.year_from, yearTo: m.year_to, hasPrice });
        const head = `${name} — ${KEYWORD[locale]}`;
        const ok = title.startsWith(head)
          && !BROKEN.test(title)
          // Delší jen tehdy, když už samotný model + klíčové slovo přeteče limit.
          && (title.length <= TITLE_MAX || title === head)
          // Za dvojtečkou jsou čísla z dat — výkon tam musí být ten modelový.
          && (!m.power_hp || !title.includes(':') || title.includes(String(m.power_hp)))
          && (hasPrice || !PRICE.test(title));
        if (!ok) bad.push(`${m.slug}: ${title}`);
      }
    }
    expect(bad).toEqual([]);
  });
});

describe('machineSeoDescription — spec-led popisek modelu', () => {
  it('Zetor 7745: konkrétní čísla (výkon, kW, roky, motor) a jen to, co stránka má', () => {
    const d = machineSeoDescription('cs', {
      title: 'Zetor 7745', singular: 'traktor', powerHp: 77, powerKw: 57, years: '1980–1998',
      engine: 'Zetor 7201, 3-válec 3,12 L', hasFaults: true, hasUsedPrice: true,
    });
    expect(d).toBe('Zetor 7745 — traktor, výkon 77 k (57 kW), roky výroby 1980–1998, motor Zetor 7201 (3-válec 3,12 L). Časté závady a obvyklá cena ojetiny.');
  });

  it('bez redakčních bloků zůstává původní tvar (+ kW)', () => {
    expect(machineSeoDescription('pl', { title: 'Massey Ferguson 235', singular: 'ciągnik', powerHp: 50, powerKw: 37, years: '1975–1986' }))
      .toBe('Massey Ferguson 235 — ciągnik, moc 50 KM (37 kW), lata produkcji 1975–1986. Pełna tabela danych technicznych.');
  });

  it('cenu ani závady neslibuje, když je stránka nemá', () => {
    const d = machineSeoDescription('cs', { title: 'Zetor 7211', singular: 'traktor', powerHp: 67, powerKw: 49, years: '1980–1998' });
    expect(d).not.toMatch(PRICE);
    expect(d).not.toContain('závady');
  });

  it.each(activeLocales)('%s: každý model s výkonem a roky — ≤ 160 znaků, výkon i roky vždy, nic prázdného', (locale) => {
    const singular = useTranslations(locale)('cat.s.d.singular.traktory');
    const bad: string[] = [];
    for (const m of getAllModels(locale)) {
      if (!m.power_hp || !m.year_from) continue;
      const years = `${m.year_from}–${m.year_to ?? 'x'}`;
      const d = machineSeoDescription(locale, {
        title: `${m.brand_name} ${m.name}`, singular, powerHp: m.power_hp, powerKw: m.power_kw, years,
        engine: m.engine, weightKg: m.weight_kg, hasFaults: true, hasUsedPrice: true,
      });
      const ok = d.length <= 160 && d.includes(String(m.power_hp)) && d.includes(years) && !/undefined|null|NaN|\{\w+\}|\(\s*\)/.test(d);
      if (!ok) bad.push(`${m.slug}: ${d}`);
    }
    expect(bad).toEqual([]);
  });

  it('do polského popisku neprosákne čeština z dat (motor)', () => {
    const bad = getAllModels('pl')
      .filter((m) => m.power_hp && m.year_from && m.engine)
      .map((m) => machineSeoDescription('pl', { title: m.name, singular: 'ciągnik', powerHp: m.power_hp!, years: String(m.year_from), engine: m.engine }))
      .filter((d) => /[ěřůĚŘŮ]|válec/.test(d));
    expect(bad).toEqual([]);
  });
});

describe('pageTitle s maxLength — brand jen když se vejde', () => {
  it('přidá brand, když se celý titulek vejde do 60 znaků', () => {
    expect(pageTitle('Zetor 7211 — technické údaje: 67 k, 1980–1998', { maxLength: 60 }))
      .toBe('Zetor 7211 — technické údaje: 67 k, 1980–1998 | agro-svět.cz');
  });
  it('vynechá brand, když by titulek přetekl', () => {
    expect(pageTitle('Zetor 7745 — technické údaje a cena: 77 k, 1980–1998', { maxLength: 60 }))
      .toBe('Zetor 7745 — technické údaje a cena: 77 k, 1980–1998');
  });
  it('bez maxLength se chová jako dřív', () => {
    expect(pageTitle('Zetor 7745 — technické údaje a cena: 77 k, 1980–1998'))
      .toBe('Zetor 7745 — technické údaje a cena: 77 k, 1980–1998 | agro-svět.cz');
  });
});

describe('firstFitting', () => {
  it('vezme první, který se vejde; když žádný, nejkratší; prázdné přeskočí', () => {
    expect(firstFitting(['x'.repeat(70), 'krátký', 'y'], 60)).toBe('krátký');
    expect(firstFitting(['x'.repeat(70), 'x'.repeat(65)], 60)).toBe('x'.repeat(65));
    expect(firstFitting([null, undefined, false, '  ', 'ok'], 60)).toBe('ok');
  });
});

describe('slovník — titulek s odpovědí', () => {
  const headword = (term: string) => term.split(' (')[0].toLowerCase();

  it('hektar má odpověď přímo v titulku', () => {
    const t = useTranslations('cs');
    const hektar = getSlovnik('cs').find((x) => x.slug === 'hektar')!;
    expect(slovnikSeoTitle(hektar, t)).toBe('Hektar (ha) = 10 000 m² — převod na ary, akry a m²');
  });

  it.each(activeLocales)('%s: hektar (nejvíc zobrazení slovníku) má převod v titulku', (locale) => {
    const t = useTranslations(locale);
    const hektar = getSlovnik(locale).find((x) => x.slug === 'hektar')!;
    expect(slovnikSeoTitle(hektar, t)).toMatch(/10 000 (m²|м²)/);
  });

  it('povinná sada hesel má `titulek` (cs)', () => {
    const cs = getSlovnik('cs');
    for (const slug of ['hektar', 'akr', 'ar', 'korec', 'lan', 'tuna', 'q-cent', 'matif', 'zentour']) {
      expect(cs.find((x) => x.slug === slug)?.titulek, slug).toBeTruthy();
    }
  });

  it.each(activeLocales)('%s: každý `titulek` ≤ 60 znaků, jmenuje heslo, jednotky nesou číslo, převod jen s převodníkem', (locale) => {
    const t = useTranslations(locale);
    const bad: string[] = [];
    for (const term of getSlovnik(locale)) {
      if (!term.titulek) continue;
      const title = slovnikSeoTitle(term, t);
      const promisesConversion = /převod|prevod|przelicz|конверт|Umrechn/i.test(title);
      const ok = title.length <= TITLE_MAX
        && !BROKEN.test(title)
        && title.toLowerCase().includes(headword(term.term))
        && (term.kategorie !== 'jednotky' || /\d/.test(title))
        && (!promisesConversion || slovnikHasConverter(term.slug));
      if (!ok) bad.push(`${term.slug}: ${title}`);
    }
    expect(bad).toEqual([]);
  });

  it.each(activeLocales.filter((l) => l !== 'cs'))('%s: `titulek` není český originál (generátor překladů ho nesmí zkopírovat)', (locale) => {
    const cs = new Map(getSlovnik('cs').map((x) => [x.slug, x.titulek]));
    const leaked = getSlovnik(locale).filter((x) => x.titulek && x.titulek === cs.get(x.slug)).map((x) => x.slug);
    expect(leaked).toEqual([]);
  });

  it('bez `titulek` zůstává obecný tvar', () => {
    const t = useTranslations('cs');
    const adblue = getSlovnik('cs').find((x) => x.slug === 'adblue')!;
    expect(slovnikSeoTitle(adblue, t)).toBe('AdBlue — co to je? Vysvětlení');
  });
});

describe('encyklopedie — titulek', () => {
  it('šablona doplní výkon a „technické údaje", ruční titulek má přednost', () => {
    expect(encSeoTitle('cs', { name: 'Fendt 942 Vario', powerHp: 415 })).toBe('Fendt 942 Vario — technické údaje, výkon 415 k');
    expect(encSeoTitle('pl', { name: 'CLAAS Lexion 8900', powerHp: 790 })).toBe('CLAAS Lexion 8900 — dane techniczne, moc 790 KM');
    expect(encSeoTitle('cs', { name: 'CLAAS Lexion 8900', powerHp: 790, titulek: 'CLAAS Lexion 8900 — 790 k, cena, spotřeba a srovnání' }))
      .toBe('CLAAS Lexion 8900 — 790 k, cena, spotřeba a srovnání');
    expect(encSeoTitle('cs', { name: 'Neznámý stroj', powerHp: null })).toBe('Neznámý stroj');
  });

  const DIRS: [Locale, string][] = [['cs', 'encyklopedie'], ['sk', 'encyklopedie-sk'], ['pl', 'encyklopedie-pl'], ['uk', 'encyklopedie-uk']];
  it.each(DIRS)('%s: všechny záznamy mají titulek ≤ 60 znaků s modelem a výkonem', (locale, dir) => {
    const bad: string[] = [];
    for (const f of readdirSync(join(ROOT, 'src/content', dir)).filter((x) => x.endsWith('.md'))) {
      const src = readFileSync(join(ROOT, 'src/content', dir, f), 'utf8');
      const fm = yaml.load(src.split(/^---$/m)[1]) as { name: string; powerHp?: number; titulek?: string };
      const title = encSeoTitle(locale, { name: fm.name, powerHp: fm.powerHp, titulek: fm.titulek });
      const ok = title.length <= TITLE_MAX && title.startsWith(fm.name) && !BROKEN.test(title)
        && (!fm.powerHp || title.includes(String(fm.powerHp)));
      if (!ok) bad.push(`${f}: ${title}`);
    }
    expect(bad).toEqual([]);
  });
});
